// Cálculo de dias e horários disponíveis.
// O Brasil não tem horário de verão desde 2019, então Brasília é sempre UTC-3.

const OFFSET = '-03:00';
const OFFSET_MS = 3 * 60 * 60 * 1000;
export const FUSO = 'America/Sao_Paulo';

export function dataValida(dataStr) {
  return (
    typeof dataStr === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(dataStr) &&
    !Number.isNaN(Date.parse(`${dataStr}T12:00:00${OFFSET}`))
  );
}

// Converte "2026-11-24" + "15:00" (horário de Brasília) num instante real
export function paraInstante(dataStr, hora) {
  return new Date(`${dataStr}T${hora}:00${OFFSET}`);
}

// Data de hoje em Brasília, no formato AAAA-MM-DD
export function hojeLocal(agora = new Date()) {
  return new Date(agora.getTime() - OFFSET_MS).toISOString().slice(0, 10);
}

export function somarDias(dataStr, dias) {
  const d = new Date(`${dataStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function diaDaSemana(dataStr) {
  return new Date(`${dataStr}T12:00:00Z`).getUTCDay();
}

// Separa um instante em data e hora de Brasília
export function partesLocais(instante) {
  const iso = new Date(new Date(instante).getTime() - OFFSET_MS).toISOString();
  return { data: iso.slice(0, 10), hora: iso.slice(11, 16) };
}

// Dias em que há atendimento, de hoje até config.diasAFrente
export function diasDisponiveis(config, agora = new Date()) {
  const hoje = hojeLocal(agora);
  const dias = [];
  for (let i = 0; i <= config.diasAFrente; i++) {
    const data = somarDias(hoje, i);
    if (horariosDoDia(config, data, agora).length > 0) dias.push(data);
  }
  return dias;
}

// Horários possíveis num dia (antes de descontar os já ocupados)
export function horariosDoDia(config, dataStr, agora = new Date()) {
  if (!dataValida(dataStr)) return [];
  if (config.datasBloqueadas.includes(dataStr)) return [];

  const hoje = hojeLocal(agora);
  if (dataStr < hoje || dataStr > somarDias(hoje, config.diasAFrente)) return [];

  const limite = agora.getTime() + config.antecedenciaMinimaHoras * 60 * 60 * 1000;
  const horas = config.horariosPorDiaDaSemana[diaDaSemana(dataStr)] || [];

  return horas
    .map((hora) => ({ hora, inicio: paraInstante(dataStr, hora).toISOString() }))
    .filter((h) => new Date(h.inicio).getTime() >= limite);
}

// Confere se um horário enviado pelo navegador é mesmo um horário válido
export function horarioPermitido(config, inicioISO, agora = new Date()) {
  const instante = new Date(inicioISO);
  if (Number.isNaN(instante.getTime())) return null;
  const { data, hora } = partesLocais(instante);
  const valido = horariosDoDia(config, data, agora).some((h) => h.hora === hora);
  return valido ? { data, hora, inicio: instante.toISOString() } : null;
}
