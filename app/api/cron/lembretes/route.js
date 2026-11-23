// GET /api/cron/lembretes
// Chamado uma vez por dia pelo GitHub (veja .github/workflows/lembretes.yml).
// Envia o lembrete para todos os agendamentos confirmados de amanhã.
// Bônus: essa consulta diária impede o Supabase gratuito de pausar por inatividade.
import { hojeLocal, paraInstante, somarDias } from '../../../../lib/horarios.js';
import { atualizarAgendamento, listarAgendamentos } from '../../../../lib/supabase.js';
import { avisarLembrete } from '../../../../lib/notificacoes.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get('authorization') !== `Bearer ${segredo}`) {
    return Response.json({ erro: 'Não autorizado' }, { status: 401 });
  }

  const amanha = somarDias(hojeLocal(), 1);
  const de = paraInstante(amanha, '00:00').toISOString();
  const ate = paraInstante(somarDias(amanha, 1), '00:00').toISOString();

  try {
    const agendamentos = await listarAgendamentos([
      ['status', 'eq.confirmado'],
      ['lembrete_enviado', 'is.false'],
      ['inicio', `gte.${de}`],
      ['inicio', `lt.${ate}`],
    ]);

    const resultados = [];
    for (const ag of agendamentos) {
      const envio = await avisarLembrete(ag);
      if (envio.email || envio.whatsapp) {
        await atualizarAgendamento(ag.id, { lembrete_enviado: true });
      }
      resultados.push(envio);
    }

    return Response.json({
      dia: amanha,
      agendamentos: agendamentos.length,
      emails: resultados.filter((r) => r.email).length,
      whatsapps: resultados.filter((r) => r.whatsapp).length,
    });
  } catch (erro) {
    console.error(erro);
    return Response.json({ erro: 'Falha ao enviar lembretes' }, { status: 500 });
  }
}
