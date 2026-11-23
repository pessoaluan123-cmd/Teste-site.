// Acesso ao banco de dados (Supabase) — só roda no servidor.
// A chave secreta NUNCA vai para o navegador.

function cabecalhos() {
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (!process.env.SUPABASE_URL || !chave) {
    throw new Error('Configure SUPABASE_URL e SUPABASE_SECRET_KEY nas variáveis de ambiente.');
  }
  return {
    apikey: chave,
    Authorization: `Bearer ${chave}`,
    'Content-Type': 'application/json',
  };
}

async function chamar(caminho, opcoes = {}) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  const resposta = await fetch(`${base}/rest/v1/${caminho}`, {
    ...opcoes,
    headers: { ...cabecalhos(), ...(opcoes.headers || {}) },
    cache: 'no-store',
  });
  const texto = await resposta.text();
  if (!resposta.ok) throw new Error(`Supabase ${resposta.status}: ${texto}`);
  return texto ? JSON.parse(texto) : null;
}

export function rpc(funcao, parametros) {
  return chamar(`rpc/${funcao}`, { method: 'POST', body: JSON.stringify(parametros) });
}

// filtros: lista de pares, ex.: [['status', 'eq.confirmado'], ['inicio', 'gte.2026-...']]
export function listarAgendamentos(filtros, ordem = 'inicio.asc') {
  const params = new URLSearchParams([['select', '*'], ...filtros, ['order', ordem]]);
  return chamar(`agendamentos?${params}`);
}

export async function buscarAgendamento(id) {
  const lista = await listarAgendamentos([['id', `eq.${id}`]]);
  return lista[0] || null;
}

export function atualizarAgendamento(id, campos) {
  const params = new URLSearchParams([['id', `eq.${id}`]]);
  return chamar(`agendamentos?${params}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(campos),
  });
}
