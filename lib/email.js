// Envio de e-mails pela Brevo (plano gratuito: 300 e-mails por dia).
import siteConfig from '../site.config.js';

export async function enviarEmail({ para, nome, assunto, html }) {
  const chave = process.env.BREVO_API_KEY;
  const remetente = process.env.EMAIL_REMETENTE;
  if (!chave || !remetente) {
    console.warn('E-mail não enviado: configure BREVO_API_KEY e EMAIL_REMETENTE.');
    return false;
  }

  try {
    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': chave, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: siteConfig.nomeProfissional, email: remetente },
        to: [{ email: para, name: nome || para }],
        subject: assunto,
        htmlContent: moldura(html),
      }),
    });
    if (!resposta.ok) {
      console.error('Erro ao enviar e-mail:', resposta.status, await resposta.text());
      return false;
    }
    return true;
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro);
    return false;
  }
}

function moldura(conteudo) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f6f3;font-family:Arial,sans-serif;color:#2b3a33">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:28px">
    ${conteudo}
    <p style="margin-top:28px;font-size:13px;color:#6b7a72">${siteConfig.nomeProfissional} · ${siteConfig.registro}</p>
  </div></body></html>`;
}
