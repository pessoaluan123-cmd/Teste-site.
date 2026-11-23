// Painel da profissional: lista e cancela agendamentos.
// Protegido pela senha definida em ADMIN_SENHA.
import { createHash, timingSafeEqual } from 'node:crypto';
import { hojeLocal, paraInstante } from '../../../../lib/horarios.js';
import { atualizarAgendamento, listarAgendamentos } from '../../../../lib/supabase.js';

export const dynamic = 'force-dynamic';

function autorizado(request) {
  const senha = process.env.ADMIN_SENHA;
  const enviada = request.headers.get('x-admin-senha') || '';
  if (!senha || senha.length < 8) return false;
  const a = createHash('sha256').update(senha).digest();
  const b = createHash('sha256').update(enviada).digest();
  return timingSafeEqual(a, b);
}

const negado = () => Response.json({ erro: 'Senha incorreta' }, { status: 401 });

export async function GET(request) {
  if (!autorizado(request)) return negado();
  try {
    const desde = paraInstante(hojeLocal(), '00:00').toISOString();
    const lista = await listarAgendamentos([
      ['inicio', `gte.${desde}`],
      ['status', 'in.(pendente,confirmado)'],
    ]);
    const agora = Date.now();
    // Esconde reservas que expiraram sem pagamento
    const ativos = lista.filter(
      (a) => a.status === 'confirmado' || new Date(a.expira_em).getTime() > agora
    );
    return Response.json({ agendamentos: ativos });
  } catch (erro) {
    console.error(erro);
    return Response.json({ erro: 'Falha ao carregar' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!autorizado(request)) return negado();
  const corpo = await request.json().catch(() => ({}));
  if (corpo.acao !== 'cancelar' || !corpo.id) {
    return Response.json({ erro: 'Pedido inválido' }, { status: 400 });
  }
  try {
    await atualizarAgendamento(corpo.id, { status: 'cancelado' });
    return Response.json({ ok: true });
  } catch (erro) {
    console.error(erro);
    return Response.json({ erro: 'Falha ao cancelar' }, { status: 500 });
  }
}
