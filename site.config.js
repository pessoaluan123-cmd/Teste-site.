// =====================================================================
// CONFIGURAÇÕES DO SITE: edite aqui os dados da profissional.
// Dá para editar direto no GitHub: abra este arquivo e clique no lápis.
// Os textos abaixo são de EXEMPLO (profissional fictícia). Troque todos.
// =====================================================================

const siteConfig = {
  nomeProfissional: 'Helena Duarte',
  titulo: 'Psicóloga clínica',
  registro: 'CRP 06/000000',
  abordagem: 'Terapia Cognitivo-Comportamental (TCC)',

  // Frase principal do topo do site e texto logo abaixo dela
  frase: 'Um espaço tranquilo para cuidar de você, no seu ritmo.',
  descricao:
    'Psicoterapia para adolescentes e adultos, online ou presencial em São Paulo. Escolha um horário livre e agende em poucos minutos.',

  // Apresentação da profissional (um item por parágrafo)
  sobre: [
    'Sou psicóloga clínica e atendo adolescentes e adultos que passam por momentos de ansiedade, cansaço, dúvidas e mudanças na vida.',
    'Trabalho com a Terapia Cognitivo-Comportamental, uma abordagem com base científica que ajuda a entender pensamentos e emoções e a construir novas formas de lidar com eles. Cada processo é construído junto com você, com escuta atenta e sem julgamentos.',
  ],
  temas: ['Ansiedade', 'Estresse e esgotamento', 'Autoestima', 'Relacionamentos', 'Luto', 'Mudanças de vida'],
  publico: 'Adolescentes a partir de 14 anos e adultos',

  atendimentoOnline: true,
  atendimentoPresencial: true,
  endereco: 'Rua das Acácias, 120, sala 34 · Pinheiros, São Paulo/SP',

  emailContato: 'contato@exemplo.com.br',
  telefoneContato: '(11) 90000-0000',

  valorConsulta: 180.0, // em reais
  duracaoMinutos: 50,
  politicaCancelamento: 'Remarcações e cancelamentos com pelo menos 24 horas de antecedência.',

  diasAFrente: 30, // até quantos dias no futuro o paciente pode agendar
  antecedenciaMinimaHoras: 12, // não deixa agendar em cima da hora
  minutosParaPagar: 30, // o horário fica reservado por esse tempo esperando o pagamento

  // Horários de início das sessões em cada dia da semana (horário de Brasília).
  // 0 = domingo, 1 = segunda, ..., 6 = sábado. Lista vazia = não atende.
  horariosPorDiaDaSemana: {
    0: [],
    1: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    2: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    3: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    4: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    5: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    6: ['09:00', '10:00', '11:00'],
  },

  // Dias sem atendimento (feriados, férias), no formato 'AAAA-MM-DD'
  datasBloqueadas: ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'],

  perguntas: [
    {
      pergunta: 'Como funciona a sessão online?',
      resposta:
        'Por videochamada, com o mesmo cuidado e sigilo da sessão presencial. Você recebe o link por e-mail antes do horário. Basta um lugar reservado e uma conexão estável.',
    },
    {
      pergunta: 'Quanto tempo dura cada sessão?',
      resposta: 'Cada sessão dura 50 minutos. A frequência mais comum é semanal, e isso é combinado com você.',
    },
    {
      pergunta: 'Posso remarcar ou cancelar?',
      resposta:
        'Pode, com pelo menos 24 horas de antecedência. É só responder o e-mail de confirmação ou mandar uma mensagem.',
    },
    {
      pergunta: 'Quais são as formas de pagamento?',
      resposta: 'Pix, cartão de crédito ou boleto, direto aqui no site na hora de agendar.',
    },
    {
      pergunta: 'Vocês emitem recibo?',
      resposta:
        'Sim. O recibo pode ser usado no Imposto de Renda e para pedir reembolso ao plano de saúde, conforme as regras do seu plano.',
    },
    {
      pergunta: 'O que eu falo na terapia fica em sigilo?',
      resposta: 'Sim. Tudo o que é dito nas sessões é sigiloso, como determina o Código de Ética Profissional do Psicólogo.',
    },
  ],
};

export default siteConfig;
