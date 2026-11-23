// POST /api/agendar -> reserva o horário e devolve o link de pagamento
import siteConfig from '../../../site.config.js';
import { horarioPermitido } from '../../../lib/horarios.js';
import { emailValido, normalizarTelefone } from '../../../lib/formatar.js';
import { buscarAgendamento, rpc, atualizarAgendamento } from '../../../lib/supabase.js';
import { criarCheckout, pagamentoAtivo } from '../../../lib/mercadopago.js';
import { avisarConfirmacao } from '../../../lib/notificacoes.js';

export const dynamic = 'force-dynamic';

function erro(mensagem, status = 400) {
  return Response.json({ erro: mensagem }, { status });
}

export async function POST(request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo) return erro('Dados inválidos.');

  // Campo invisível: pessoas não preenchem, robôs de spam sim
  if (corpo.empresa) return Response.json({ redirecionar: '/sucesso' });

  const nome = String(corpo.nome || '').trim();
  const email = String(corpo.email || '').trim().toLowerCase();
  const telefone = normalizarTelefone(corpo.telefone);

  if (nome.length < 3 || nome.length > 100) return erro('Informe seu nome completo.');
  if (!emailValido(email)) return erro('Informe um e-mail válido.');
  if (!telefone) return erro('Informe um WhatsApp válido, com DDD.');
  if (corpo.consentimento !== true) return erro('É preciso aceitar a política de privacidade.');

  const horario = horarioPermitido(siteConfig, corpo.inicio);
  if (!horario) return erro('Esse horário não está mais disponível. Escolha outro.', 409);

  const inicio = new Date(horario.inicio);
  const fim = new Date(inicio.getTime() + siteConfig.duracaoMinutos * 60 * 1000);

  try {
    const id = await rpc('reservar_horario', {
      p_nome: nome,
      p_email: email,
      p_telefone: telefone,
      p_inicio: inicio.toISOString(),
      p_fim: fim.toISOString(),
      p_minutos_reserva: siteConfig.minutosParaPagar,
    });

    if (!id) {
      return erro('Alguém acabou de reservar esse horário. Por favor, escolha outro.', 409);
    }

    // Sem Mercado Pago configurado: confirma direto (modo de teste)
    if (!pagamentoAtivo()) {
      const resultado = await rpc('confirmar_agendamento', { p_id: id, p_pagamento_id: 'sem-pagamento' });
      if (resultado === 'confirmado') await avisarConfirmacao(await buscarAgendamento(id));
      return Response.json({ redirecionar: '/sucesso' });
    }

    try {
      const expiraEm = new Date(Date.now() + siteConfig.minutosParaPagar * 60 * 1000);
      const linkPagamento = await criarCheckout({
        agendamentoId: id,
        descricao: `Sessão de ${siteConfig.duracaoMinutos} min - ${siteConfig.nomeProfissional}`,
        valor: siteConfig.valorConsulta,
        nome,
        email,
        expiraEm,
      });
      return Response.json({ redirecionar: linkPagamento });
    } catch (falhaPagamento) {
      // Libera o horário se não deu para gerar o pagamento
      await atualizarAgendamento(id, { status: 'expirado' });
      throw falhaPagamento;
    }
  } catch (falha) {
    console.error(falha);
    return erro('Algo deu errado do nosso lado. Tente de novo em instantes.', 500);
  }
}
