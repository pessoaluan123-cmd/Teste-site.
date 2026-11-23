// Modo demonstração: o site funciona sem banco de dados e sem chaves.
// Os agendamentos ficam guardados só no navegador de quem está testando.
import siteConfig from '../site.config.js';
import { horariosDoDia, hojeLocal, somarDias, paraInstante } from './horarios.js';

const CHAVE = 'agenda-demo-v1';
let memoria = [];

export function lerAgendamentosDemo() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || '[]');
    return Array.isArray(salvo) ? salvo : [];
  } catch {
    return memoria;
  }
}

function gravar(lista) {
  memoria = lista;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    // navegador sem armazenamento: fica só na memória enquanto a página estiver aberta
  }
}

export function salvarAgendamentoDemo(ag) {
  gravar([...lerAgendamentosDemo(), ag]);
}

export function cancelarAgendamentoDemo(id) {
  gravar(lerAgendamentosDemo().map((a) => (a.id === id ? { ...a, status: 'cancelado' } : a)));
}

// Número pseudoaleatório fixo para cada texto (sempre o mesmo resultado)
function sorteio(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

// Parte dos horários aparece ocupada, para a demonstração parecer real
function ocupadoNaDemo(inicio) {
  return sorteio(inicio) < 0.32;
}

export function horariosLivresDemo(data, agora = new Date()) {
  const meus = new Set(
    lerAgendamentosDemo()
      .filter((a) => a.status !== 'cancelado')
      .map((a) => new Date(a.inicio).getTime())
  );
  return horariosDoDia(siteConfig, data, agora).filter(
    (h) => !ocupadoNaDemo(h.inicio) && !meus.has(new Date(h.inicio).getTime())
  );
}

// Pacientes fictícios para o painel da demonstração
const NOMES = ['Mariana Alves', 'Rafael Costa', 'Beatriz Lima', 'João Pereira', 'Camila Rocha', 'Lucas Martins'];

export function exemplosPainel(agora = new Date()) {
  const lista = [];
  const hoje = hojeLocal(agora);
  for (let i = 0; i < 10 && lista.length < NOMES.length; i++) {
    const data = somarDias(hoje, i);
    const horas = siteConfig.horariosPorDiaDaSemana[new Date(`${data}T12:00:00Z`).getUTCDay()] || [];
    const hora = horas[Math.floor(sorteio(data) * horas.length)];
    if (!hora || siteConfig.datasBloqueadas.includes(data)) continue;
    const nome = NOMES[lista.length];
    lista.push({
      id: `exemplo-${data}`,
      nome,
      email: `${nome.split(' ')[0].toLowerCase()}@exemplo.com`,
      telefone: '5511900000000',
      inicio: paraInstante(data, hora).toISOString(),
      status: lista.length === 2 ? 'pendente' : 'confirmado',
      exemplo: true,
    });
  }
  return lista;
}
