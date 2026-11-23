import siteConfig from '../site.config.js';
import { formatarDinheiro } from '../lib/formatar.js';
import Ilustracao from './Ilustracao.js';
import Agendamento from './Agendamento.js';

const modalidades = [siteConfig.atendimentoOnline && 'Online', siteConfig.atendimentoPresencial && 'Presencial']
  .filter(Boolean)
  .join(' e ');

function iniciais(nome) {
  return nome
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
}

const passos = [
  {
    titulo: 'Escolha o horário',
    texto: 'Veja os horários livres dos próximos dias e escolha o que cabe na sua rotina.',
    icone: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="6" y="10" width="36" height="32" rx="7" fill="#2c4f7c" />
        <rect x="6" y="10" width="36" height="10" rx="5" fill="#1f3a5f" />
        <rect x="14" y="6" width="4" height="9" rx="2" fill="#1f3a5f" />
        <rect x="30" y="6" width="4" height="9" rx="2" fill="#1f3a5f" />
        <circle cx="30" cy="31" r="5" fill="#ee7457" />
      </svg>
    ),
  },
  {
    titulo: 'Confirme com Pix ou cartão',
    texto: 'O pagamento é feito no próprio site, de forma segura. O horário fica reservado para você.',
    icone: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="4" y="12" width="40" height="26" rx="6" fill="#2c4f7c" />
        <rect x="4" y="18" width="40" height="6" fill="#1f3a5f" />
        <rect x="10" y="29" width="14" height="4" rx="2" fill="#ee7457" />
      </svg>
    ),
  },
  {
    titulo: 'Receba a confirmação',
    texto: 'Chega um e-mail na hora e um lembrete por e-mail e WhatsApp no dia anterior.',
    icone: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 10 h32 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-18 l-9 7 v-7 h-5 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6z" fill="#2c4f7c" />
        <path d="M15 23 l6 6 l12 -12" stroke="#ee7457" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function PaginaInicial({ modoDemo, comPagamento, dias, links = {} }) {
  const valor = formatarDinheiro(siteConfig.valorConsulta);
  return (
    <>
      <section className="heroi">
        <div className="heroi-texto">
          <p className="heroi-sobre">
            {siteConfig.titulo} · {siteConfig.registro}
          </p>
          <h1>{siteConfig.frase}</h1>
          <p className="heroi-descricao">{siteConfig.descricao}</p>
          <ul className="heroi-fatos">
            <li>{modalidades}</li>
            <li>Sessões de {siteConfig.duracaoMinutos} min</li>
            <li>{valor}</li>
          </ul>
          <div className="heroi-acoes">
            <a className="botao" href="#agendar">
              Ver horários livres
            </a>
            <a className="botao claro" href="#sobre">
              Conhecer a {siteConfig.nomeProfissional.split(' ')[0]}
            </a>
          </div>
        </div>
        <div className="heroi-figura">
          <Ilustracao />
        </div>
      </section>

      <section className="faixa" id="agendar">
        <div className="faixa-titulo">
          <h2>Agende sua sessão</h2>
          <p>Horários de Brasília. Você recebe tudo por e-mail logo depois.</p>
        </div>
        <Agendamento
          dias={dias}
          modoDemo={modoDemo}
          comPagamento={comPagamento}
          valor={valor}
          linkPainel={links.painel || '/admin'}
          linkPrivacidade={links.privacidade || '/privacidade'}
        />
      </section>

      <section className="faixa suave" id="como-funciona">
        <div className="faixa-titulo">
          <h2>Como funciona</h2>
        </div>
        <ol className="passos">
          {passos.map((p) => (
            <li key={p.titulo}>
              {p.icone}
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="faixa sobre" id="sobre">
        <div className="retrato" aria-hidden="true">
          <span>{iniciais(siteConfig.nomeProfissional)}</span>
        </div>
        <div className="sobre-texto">
          <h2>Prazer, sou a {siteConfig.nomeProfissional}</h2>
          {siteConfig.sobre.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
          <dl className="ficha">
            <div>
              <dt>Abordagem</dt>
              <dd>{siteConfig.abordagem}</dd>
            </div>
            <div>
              <dt>Atende</dt>
              <dd>{siteConfig.publico}</dd>
            </div>
          </dl>
          <ul className="temas">
            {siteConfig.temas.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faixa suave">
        <div className="faixa-titulo">
          <h2>Atendimento</h2>
        </div>
        <div className="cartoes">
          {siteConfig.atendimentoOnline && (
            <article className="cartao-info">
              <h3>Online</h3>
              <p>Por videochamada, de onde você estiver. O link chega por e-mail antes da sessão.</p>
            </article>
          )}
          {siteConfig.atendimentoPresencial && (
            <article className="cartao-info">
              <h3>Presencial</h3>
              <p>{siteConfig.endereco}</p>
            </article>
          )}
          <article className="cartao-info destaque">
            <h3>{valor}</h3>
            <p>
              Sessão de {siteConfig.duracaoMinutos} minutos. {siteConfig.politicaCancelamento}
            </p>
          </article>
        </div>
      </section>

      <section className="faixa duvidas" id="duvidas">
        <div className="faixa-titulo">
          <h2>Dúvidas frequentes</h2>
        </div>
        <div className="lista-duvidas">
          {siteConfig.perguntas.map((item) => (
            <details key={item.pergunta}>
              <summary>{item.pergunta}</summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="chamada">
        <h2>Dar o primeiro passo pode ser simples.</h2>
        <a className="botao" href="#agendar">
          Escolher um horário
        </a>
      </section>
    </>
  );
}
