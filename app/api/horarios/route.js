// GET /api/horarios?data=2026-11-24 -> horários livres nesse dia
import siteConfig from '../../../site.config.js';
import { horariosDoDia, paraInstante, somarDias } from '../../../lib/horarios.js';
import { rpc } from '../../../lib/supabase.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const data = request.nextUrl.searchParams.get('data');
  const possiveis = horariosDoDia(siteConfig, data);
  if (possiveis.length === 0) return Response.json({ horarios: [] });

  try {
    const ocupados = await rpc('horarios_ocupados', {
      p_de: paraInstante(data, '00:00').toISOString(),
      p_ate: paraInstante(somarDias(data, 1), '00:00').toISOString(),
    });
    const tomados = new Set(ocupados.map((o) => new Date(o.horario).getTime()));
    const livres = possiveis.filter((h) => !tomados.has(new Date(h.inicio).getTime()));
    return Response.json({ horarios: livres });
  } catch (erro) {
    console.error(erro);
    return Response.json({ erro: 'Não foi possível carregar os horários.' }, { status: 500 });
  }
}
