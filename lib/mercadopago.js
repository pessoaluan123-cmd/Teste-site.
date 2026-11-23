// Pagamento pelo Mercado Pago (Checkout Pro: Pix, cartão e boleto).
// Se MERCADOPAGO_ACCESS_TOKEN não estiver configurado, o site confirma
// os agendamentos sem pagamento (útil para testar no começo).

const API = 'https://api.mercadopago.com';

export function pagamentoAtivo() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

export function urlDoSite() {
  // A Netlify preenche URL sozinha; SITE_URL serve para usar um domínio próprio.
  return (process.env.SITE_URL || process.env.URL || 'http://localhost:3000').replace(/\/$/, '');
}

// Data no formato que o Mercado Pago espera: 2026-11-24T15:00:00.000-03:00
function dataMercadoPago(instante) {
  const local = new Date(new Date(instante).getTime() - 3 * 60 * 60 * 1000);
  return local.toISOString().replace('Z', '-03:00');
}

export async function criarCheckout({ agendamentoId, descricao, valor, nome, email, expiraEm }) {
  const base = urlDoSite();
  const publico = base.startsWith('https://');

  const preferencia = {
    items: [{ id: 'sessao', title: descricao, quantity: 1, unit_price: Number(valor), currency_id: 'BRL' }],
    payer: { name: nome, email },
    external_reference: agendamentoId,
    back_urls: {
      success: `${base}/sucesso`,
      pending: `${base}/pagamento-pendente`,
      failure: `${base}/erro`,
    },
    expires: true,
    expiration_date_from: dataMercadoPago(new Date()),
    expiration_date_to: dataMercadoPago(expiraEm),
    date_of_expiration: dataMercadoPago(expiraEm), // prazo do Pix/boleto
  };
  // O Mercado Pago só aceita estes campos com um endereço https público
  if (publico) {
    preferencia.auto_return = 'approved';
    preferencia.notification_url = `${base}/api/webhook/mercadopago`;
  }

  const resposta = await fetch(`${API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencia),
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(`Mercado Pago ${resposta.status}: ${JSON.stringify(dados)}`);
  return dados.init_point;
}

export async function buscarPagamento(id) {
  const resposta = await fetch(`${API}/v1/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    cache: 'no-store',
  });
  if (!resposta.ok) throw new Error(`Mercado Pago ${resposta.status}: ${await resposta.text()}`);
  return resposta.json();
}
