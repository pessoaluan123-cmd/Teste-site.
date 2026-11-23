// Textos dos e-mails e do WhatsApp.
// Mensagens neutras de propósito: outras pessoas podem ver a tela do celular
// do paciente, então não usamos "terapia", "psicóloga" etc. no assunto.
import siteConfig from '../site.config.js';
import { enviarEmail } from './email.js';
import { enviarWhatsApp } from './whatsapp.js';
import { escaparHtml, formatarData, formatarDataHora, formatarHora } from './formatar.js';

function primeiroNome(nome) {
  return String(nome).trim().split(/\s+/)[0];
}

export async function avisarConfirmacao(ag) {
  const quando = formatarDataHora(ag.inicio);
  const nome = escaparHtml(primeiroNome(ag.nome));

  await enviarEmail({
    para: ag.email,
    nome: ag.nome,
    assunto: `Horário confirmado: ${quando}`,
    html: `<h2 style="margin-top:0">Olá, ${nome}!</h2>
      <p>Seu horário está confirmado:</p>
      <p style="font-size:20px;font-weight:bold">${escaparHtml(quando)}</p>
      <p>Você vai receber um lembrete no dia anterior. Se precisar remarcar, é só responder este e-mail.</p>`,
  });

  const emailProfissional = process.env.EMAIL_PROFISSIONAL;
  if (emailProfissional) {
    await enviarEmail({
      para: emailProfissional,
      nome: siteConfig.nomeProfissional,
      assunto: `Novo agendamento: ${quando}`,
      html: `<h2 style="margin-top:0">Novo agendamento</h2>
        <p><b>${escaparHtml(ag.nome)}</b><br>${escaparHtml(quando)}</p>
        <p>E-mail: ${escaparHtml(ag.email)}<br>WhatsApp: +${escaparHtml(ag.telefone)}</p>`,
    });
  }
}

export async function avisarLembrete(ag) {
  const nome = primeiroNome(ag.nome);
  const quando = formatarDataHora(ag.inicio);

  const email = await enviarEmail({
    para: ag.email,
    nome: ag.nome,
    assunto: `Lembrete: seu horário ${quando}`,
    html: `<h2 style="margin-top:0">Olá, ${escaparHtml(nome)}!</h2>
      <p>Passando para lembrar do seu horário:</p>
      <p style="font-size:20px;font-weight:bold">${escaparHtml(quando)}</p>
      <p>Se não puder comparecer, responda este e-mail o quanto antes.</p>`,
  });

  // Modelo do WhatsApp: {{1}} = nome, {{2}} = data, {{3}} = hora
  const whatsapp = await enviarWhatsApp({
    telefone: ag.telefone,
    parametros: [nome, formatarData(ag.inicio), formatarHora(ag.inicio)],
  });

  return { email, whatsapp };
}

export async function avisarConflito(ag, pagamentoId) {
  const emailProfissional = process.env.EMAIL_PROFISSIONAL;
  if (!emailProfissional) return;
  await enviarEmail({
    para: emailProfissional,
    nome: siteConfig.nomeProfissional,
    assunto: 'ATENÇÃO: pagamento recebido para horário já ocupado',
    html: `<h2 style="margin-top:0">Pagamento precisa de atenção</h2>
      <p><b>${escaparHtml(ag.nome)}</b> pagou depois do prazo e o horário
      ${escaparHtml(formatarDataHora(ag.inicio))} já tinha sido reservado por outra pessoa.</p>
      <p>Entre em contato para remarcar ou devolva o valor pelo painel do Mercado Pago
      (pagamento nº ${escaparHtml(pagamentoId)}).</p>
      <p>E-mail: ${escaparHtml(ag.email)}<br>WhatsApp: +${escaparHtml(ag.telefone)}</p>`,
  });
}
