'use client';

import { useEffect, useRef, useState } from 'react';
import siteConfig from '../site.config.js';
import { diasDisponiveis } from '../lib/horarios.js';
import {
  emailValido,
  formatarData,
  formatarDataHora,
  formatarHora,
  normalizarTelefone,
  primeiraMaiuscula,
  rotuloDia,
} from '../lib/formatar.js';
import { horariosLivresDemo, salvarAgendamentoDemo } from '../lib/demo.js';

const formVazio = { nome: '', email: '', telefone: '', empresa: '', consentimento: false };

// Desenho de QR Code de exemplo (não é um código de pagamento de verdade)
function QrExemplo({ semente }) {
  const n = 21;
  let s = 7;
  for (const c of semente) s = (s * 31 + c.charCodeAt(0)) % 2147483647;
  const celulas = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      s = (s * 16807) % 2147483647;
      const canto = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!canto && s % 2) celulas.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  const marcador = (x, y) => (
    <g key={`m${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg className="qr" viewBox="-1 -1 23 23" aria-label="QR Code de exemplo">
      <rect x="-1" y="-1" width="23" height="23" fill="#fff" />
      <g fill="#1f3a5f">
        {celulas}
        {marcador(0, 0)}
        {marcador(14, 0)}
        {marcador(0, 14)}
      </g>
    </svg>
  );
}

export default function Agendamento({ dias: diasIniciais, modoDemo, comPagamento, valor, linkPainel, linkPrivacidade }) {
  const [dias] = useState(() => diasIniciais || diasDisponiveis(siteConfig));
  const [dia, setDia] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [escolhido, setEscolhido] = useState(null);
  const [form, setForm] = useState(formVazio);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [etapa, setEtapa] = useState('escolher'); // escolher | pagar | pronto
  const [confirmado, setConfirmado] = useState(null);
  const painelRef = useRef(null);

  async function escolherDia(data) {
    setDia(data);
    setEscolhido(null);
    setErro('');
    if (modoDemo) {
      setHorarios(horariosLivresDemo(data));
      return;
    }
    setCarregando(true);
    try {
      const resposta = await fetch(`/api/horarios?data=${data}`);
      const json = await resposta.json();
      if (!resposta.ok) throw new Error(json.erro);
      setHorarios(json.horarios);
    } catch {
      setHorarios([]);
      setErro('Não foi possível carregar os horários. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  // Abre já com o primeiro dia disponível selecionado
  useEffect(() => {
    if (dias.length) escolherDia(dias[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function rolarParaPainel() {
    requestAnimationFrame(() => {
      const el = painelRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function escolherHorario(h) {
    setEscolhido(h);
    setErro('');
    rolarParaPainel();
  }

  function atualizar(campo) {
    return (e) => {
      const valorCampo = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((atual) => ({ ...atual, [campo]: valorCampo }));
    };
  }

  function validar() {
    if (form.nome.trim().length < 3) return 'Informe seu nome completo.';
    if (!emailValido(form.email.trim())) return 'Informe um e-mail válido.';
    if (!normalizarTelefone(form.telefone)) return 'Informe um WhatsApp válido, com DDD.';
    if (!form.consentimento) return 'É preciso aceitar a política de privacidade.';
    return '';
  }

  async function enviar(e) {
    e.preventDefault();
    const problema = validar();
    if (problema) {
      setErro(problema);
      return;
    }
    setErro('');

    if (modoDemo) {
      setEtapa('pagar');
      rolarParaPainel();
      return;
    }

    setEnviando(true);
    try {
      const resposta = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, inicio: escolhido.inicio }),
      });
      const json = await resposta.json();
      if (!resposta.ok) {
        setErro(json.erro || 'Não foi possível agendar.');
        // Horário foi ocupado por outra pessoa: recarrega a lista
        if (resposta.status === 409) escolherDia(dia);
        setEnviando(false);
        return;
      }
      window.location.href = json.redirecionar;
    } catch {
      setErro('Sem conexão. Verifique sua internet e tente de novo.');
      setEnviando(false);
    }
  }

  function aprovarPagamentoDemo() {
    // Confere de novo se o horário continua livre (como o banco faz no site real)
    const aindaLivre = horariosLivresDemo(dia).some((h) => h.inicio === escolhido.inicio);
    if (!aindaLivre) {
      setEtapa('escolher');
      setErro('Esse horário acabou de ser reservado. Escolha outro.');
      escolherDia(dia);
      return;
    }
    const agendamento = {
      id: `demo-${Date.now()}`,
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      telefone: normalizarTelefone(form.telefone),
      inicio: escolhido.inicio,
      status: 'confirmado',
    };
    salvarAgendamentoDemo(agendamento);
    setConfirmado(agendamento);
    setEtapa('pronto');
    rolarParaPainel();
  }

  function recomecar() {
    setEtapa('escolher');
    setConfirmado(null);
    setForm(formVazio);
    escolherDia(dia);
  }

  if (dias.length === 0) {
    return (
      <div className="agenda">
        <p className="aviso">No momento não há horários abertos. Volte em breve.</p>
      </div>
    );
  }

  return (
    <div className="agenda">
      <div className="agenda-escolha">
        <h3 className="rotulo-etapa">Dia</h3>
        <div className="dias" role="listbox" aria-label="Dias disponíveis">
          {dias.map((d) => {
            const { semana, dia: rotulo } = rotuloDia(d);
            return (
              <button
                key={d}
                type="button"
                role="option"
                aria-selected={dia === d}
                className={`dia ${dia === d ? 'ativo' : ''}`}
                onClick={() => escolherDia(d)}
                disabled={etapa !== 'escolher'}
              >
                <span>{semana}</span>
                <strong>{rotulo}</strong>
              </button>
            );
          })}
        </div>

        <h3 className="rotulo-etapa">
          Horário {dia && <span className="dia-extenso">· {formatarData(`${dia}T15:00:00Z`)}</span>}
        </h3>
        {carregando && <p className="aviso">Carregando horários...</p>}
        {!carregando && dia && horarios.length === 0 && (
          <p className="aviso">Nenhum horário livre neste dia. Tente outro dia.</p>
        )}
        <div className="horarios">
          {!carregando &&
            horarios.map((h) => (
              <button
                key={h.inicio}
                type="button"
                className={`horario ${escolhido?.inicio === h.inicio ? 'ativo' : ''}`}
                onClick={() => escolherHorario(h)}
                disabled={etapa !== 'escolher'}
              >
                {h.hora}
              </button>
            ))}
        </div>
      </div>

      <div className="agenda-painel" ref={painelRef}>
        {etapa === 'escolher' && (
          <form onSubmit={enviar} noValidate>
            <div className={`resumo ${escolhido ? '' : 'vazio'}`}>
              {escolhido ? (
                <>
                  <strong>{primeiraMaiuscula(formatarDataHora(escolhido.inicio))}</strong>
                  <span>
                    {siteConfig.duracaoMinutos} min · {valor}
                  </span>
                </>
              ) : (
                <span>Escolha um dia e um horário.</span>
              )}
            </div>

            <fieldset disabled={!escolhido || enviando}>
              <div className="campo">
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" autoComplete="name" value={form.nome} onChange={atualizar('nome')} />
              </div>
              <div className="campo">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={atualizar('email')} />
              </div>
              <div className="campo">
                <label htmlFor="telefone">WhatsApp com DDD</label>
                <input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 98765-4321"
                  value={form.telefone}
                  onChange={atualizar('telefone')}
                />
              </div>

              {/* Armadilha para robôs: fica invisível para pessoas */}
              <div className="escondido" aria-hidden="true">
                <label htmlFor="empresa">Empresa</label>
                <input id="empresa" tabIndex={-1} autoComplete="off" value={form.empresa} onChange={atualizar('empresa')} />
              </div>

              <label className="consentimento" htmlFor="consentimento">
                <input
                  id="consentimento"
                  type="checkbox"
                  checked={form.consentimento}
                  onChange={atualizar('consentimento')}
                />
                <span>
                  Li e concordo com a <a href={linkPrivacidade}>política de privacidade</a>.
                </span>
              </label>

              {erro && <p className="erro">{erro}</p>}

              <button className="botao largo" type="submit">
                {enviando ? 'Aguarde...' : comPagamento || modoDemo ? `Ir para o pagamento · ${valor}` : 'Confirmar agendamento'}
              </button>
            </fieldset>
            <p className="aviso pequeno">
              Pix, cartão ou boleto. O horário fica reservado por {siteConfig.minutosParaPagar} minutos enquanto você paga.
            </p>
          </form>
        )}

        {etapa === 'pagar' && (
          <div className="pagamento">
            <h3>Pagamento</h3>
            <p className="valor-grande">{valor}</p>
            <p>{primeiraMaiuscula(formatarDataHora(escolhido.inicio))}</p>
            <QrExemplo semente={escolhido.inicio + form.nome} />
            <p className="aviso pequeno">
              Simulação. No site real, aqui abre o pagamento seguro com Pix, cartão ou boleto, e a sessão é confirmada
              sozinha quando o pagamento é aprovado.
            </p>
            <button className="botao largo" type="button" onClick={aprovarPagamentoDemo}>
              Simular pagamento aprovado
            </button>
            <button className="botao-texto" type="button" onClick={() => setEtapa('escolher')}>
              Voltar e alterar dados
            </button>
          </div>
        )}

        {etapa === 'pronto' && confirmado && (
          <div className="confirmacao">
            <svg className="selo-ok" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="22" fill="#ee7457" />
              <path d="M14 25 l7 7 l13 -15" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>Sessão confirmada</h3>
            <p className="quando">{primeiraMaiuscula(formatarDataHora(confirmado.inicio))}</p>
            <p>
              A confirmação foi para <b>{confirmado.email}</b>.
            </p>

            <p className="rotulo-previa">Lembrete que chega no dia anterior</p>
            <div className="previa-mensagem">
              <p>
                Olá, {confirmado.nome.split(' ')[0]}! Passando para lembrar do seu horário: {formatarData(confirmado.inicio)},
                às {formatarHora(confirmado.inicio)}. Se precisar remarcar, responda esta mensagem.
              </p>
              <span>WhatsApp e e-mail · 09:00</span>
            </div>

            <div className="confirmacao-acoes">
              <a className="botao claro" href={linkPainel}>
                Ver no painel da profissional
              </a>
              <button className="botao-texto" type="button" onClick={recomecar}>
                Agendar outro horário
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
