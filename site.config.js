// =====================================================================
// CONFIGURAÇÕES DO SITE — edite aqui os dados da profissional.
// Dá para editar direto no GitHub: abra este arquivo e clique no lápis.
// =====================================================================

const siteConfig = {
  nomeProfissional: 'Dra. Nome Sobrenome',
  registro: 'CRP 00/000000',
  descricao: 'Psicoterapia para adolescentes e adultos. Atendimento online e presencial.',
  emailContato: 'contato@exemplo.com', // aparece na política de privacidade

  valorConsulta: 150.0, // em reais
  duracaoMinutos: 50,

  diasAFrente: 30, // até quantos dias no futuro o paciente pode agendar
  antecedenciaMinimaHoras: 12, // não deixa agendar em cima da hora
  minutosParaPagar: 30, // o horário fica reservado por esse tempo esperando o pagamento

  // Horários de início das sessões em cada dia da semana (horário de Brasília).
  // 0 = domingo, 1 = segunda, ..., 6 = sábado. Lista vazia = não atende.
  horariosPorDiaDaSemana: {
    0: [],
    1: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    2: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    3: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    4: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
    5: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    6: [],
  },

  // Dias sem atendimento (feriados, férias), no formato 'AAAA-MM-DD'
  datasBloqueadas: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],
};

export default siteConfig;
