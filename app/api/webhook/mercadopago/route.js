// POST /api/webhook/mercadopago
// O Mercado Pago chama este endereço quando um pagamento muda de situação.
// Por segurança, não confiamos no que chega: consultamos o pagamento direto
// na API do Mercado Pago antes de confirmar qualquer coisa.
import { buscarPagamento, pagamentoAtivo } from '../../../../lib/mercadopago.js';
import { buscarAgendamento, rpc } from '../../../../lib/supabase.js';
import { avisarConfirmacao, avisarConflito } from '../../../../lib/notificacoes.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!pagamentoAtivo()) return new Response('ok');

  const params = request.nextUrl.searchParams;
  const corpo = await request.json().catch(() => ({}));
  const tipo = corpo?.type || params.get('type') || params.get('topic');
  const pagamentoId = corpo?.data?.id || params.get('data.id') || params.get('id');

  if (tipo !== 'payment' || !pagamentoId) return new Response('ignorado');

  try {
    const pagamento = await buscarPagamento(pagamentoId);
    const agendamentoId = pagamento.external_reference;
    if (pagamento.status !== 'approved' || !agendamentoId) return new Response('ok');

    const resultado = await rpc('confirmar_agendamento', {
      p_id: agendamentoId,
      p_pagamento_id: String(pagamento.id),
    });

    if (resultado === 'confirmado') {
      await avisarConfirmacao(await buscarAgendamento(agendamentoId));
    } else if (resultado === 'conflito' || resultado === 'cancelado') {
      await avisarConflito(await buscarAgendamento(agendamentoId), String(pagamento.id));
    }
    return new Response('ok');
  } catch (erro) {
    console.error(erro);
    // Status de erro faz o Mercado Pago tentar de novo mais tarde
    return new Response('erro', { status: 500 });
  }
}
