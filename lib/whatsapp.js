// Envio de lembretes pela API oficial do WhatsApp (Meta).
// É opcional: se as variáveis não estiverem configuradas, o site só pula o WhatsApp.

export function whatsappAtivo() {
  return Boolean(
    process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_TEMPLATE
  );
}

// parametros: textos que preenchem {{1}}, {{2}}, {{3}}... do modelo aprovado pela Meta
export async function enviarWhatsApp({ telefone, parametros }) {
  if (!whatsappAtivo()) return false;

  const versao = process.env.WHATSAPP_API_VERSION || 'v23.0';
  try {
    const resposta = await fetch(
      `https://graph.facebook.com/${versao}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: telefone,
          type: 'template',
          template: {
            name: process.env.WHATSAPP_TEMPLATE,
            language: { code: process.env.WHATSAPP_IDIOMA || 'pt_BR' },
            components: [
              { type: 'body', parameters: parametros.map((texto) => ({ type: 'text', text: texto })) },
            ],
          },
        }),
      }
    );
    if (!resposta.ok) {
      console.error('Erro ao enviar WhatsApp:', resposta.status, await resposta.text());
      return false;
    }
    return true;
  } catch (erro) {
    console.error('Erro ao enviar WhatsApp:', erro);
    return false;
  }
}
