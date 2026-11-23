'use client';

import { useEffect, useState } from 'react';
import siteConfig from '../site.config.js';
import { formatarData, formatarDinheiro, formatarHora, primeiraMaiuscula } from '../lib/formatar.js';
import { cancelarAgendamentoDemo, exemplosPainel, lerAgendamentosDemo } from '../lib/demo.js';

const CHAVE = 'senha-painel';

function lerSenhaSalva() {
  try {
    return sessionStorage.getItem(CHAVE) || '';
  } catch {
    return '';
  }
}

function salvarSenha(senha) {
  try {
    if (senha) sessionStorage.setItem(CHAVE, senha);
    else sessionStorage.removeItem(CHAVE);
  } catch {
    // navegador bloqueou o armazenamento: só pede a senha de novo
  }
}

function listaDemo(removidos) {
  const limite = Date.now() - 60 * 60 * 1000;
  return [...exemplosPainel(), ...lerAgendamentosDemo()]
    .filter((a) => a.status !== 'cancelado' && !removidos.includes(a.id))
    .filter((a) => new Date(a.inicio).getTime() > limite)
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
}

function agruparPorDia(lista) {
  const grupos = [];
  for (const ag of lista) {
    const dia = formatarData(ag.inicio);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.dia === dia) ultimo.itens.push(ag);
    else grupos.push({ dia, itens: [ag] });
  }
  return grupos;
}

export default function PainelAdmin({ modoDemo, linkInicio = '/' }) {
  const [senha, setSenha] = useState('');
  const [entrou, setEntrou] = useState(Boolean(modoDemo));
  const [lista, setLista] = useState([]);
  const [removidos, setRemovidos] = useState([]);
  const [confirmando, setConfirmando] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar(senhaUsada) {
    if (modoDemo) {
      setLista(listaDemo(removidos));
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch('/api/admin/agendamentos', { headers: { 'x-admin-senha': senhaUsada } });
      const json = await resposta.json();
      if (!resposta.ok) {
        setErro(json.erro || 'Erro ao carregar');
        setEntrou(false);
        salvarSenha('');
        return;
      }
      setLista(json.agendamentos);
      setEntrou(true);
      salvarSenha(senhaUsada);
    } catch {
      setErro('Sem conexão.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (modoDemo) {
      setLista(listaDemo([]));
      return;
    }
    const salva = lerSenhaSalva();
    if (salva) {
      setSenha(salva);
      carregar(salva);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancelar(ag) {
    setConfirmando(null);
    if (modoDemo) {
      if (ag.exemplo) {
        const novos = [...removidos, ag.id];
        setRemovidos(novos);
        setLista(listaDemo(novos));
      } else {
        cancelarAgendamentoDemo(ag.id);
        setLista(listaDemo(removidos));
      }
      return;
    }
    const resposta = await fetch('/api/admin/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-senha': senha },
      body: JSON.stringify({ acao: 'cancelar', id: ag.id }),
    });
    if (resposta.ok) carregar(senha);
    else setErro('Não foi possível cancelar.');
  }

  if (!entrou) {
    return (
      <section className="faixa">
        <form
          className="cartao-login"
          onSubmit={(e) => {
            e.preventDefault();
            carregar(senha);
          }}
        >
          <h1>Área da profissional</h1>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button className="botao largo" type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    );
  }

  const confirmados = lista.filter((a) => a.status === 'confirmado');
  const fimSemana = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const daSemana = confirmados.filter((a) => new Date(a.inicio).getTime() < fimSemana);

  return (
    <section className="faixa painel">
      <div className="painel-topo">
        <div>
          <h1>Agenda</h1>
          <p>Olá, {siteConfig.nomeProfissional.split(' ')[0]}. Estes são os próximos atendimentos.</p>
        </div>
        <a className="botao claro" href={linkInicio}>
          Ver o site
        </a>
      </div>

      <div className="numeros">
        <div>
          <strong>{daSemana.length}</strong>
          <span>sessões pagas nos próximos 7 dias</span>
        </div>
        <div>
          <strong>{formatarDinheiro(daSemana.length * siteConfig.valorConsulta)}</strong>
          <span>previstos na semana</span>
        </div>
        <div>
          <strong>{lista.length - confirmados.length}</strong>
          <span>aguardando pagamento</span>
        </div>
      </div>

      {erro && <p className="erro">{erro}</p>}
      {lista.length === 0 && <p className="aviso">Nenhum agendamento por enquanto.</p>}

      {agruparPorDia(lista).map((grupo) => (
        <div className="grupo-dia" key={grupo.dia}>
          <h2>{primeiraMaiuscula(grupo.dia)}</h2>
          <ul className="lista-admin">
            {grupo.itens.map((ag) => (
              <li key={ag.id} className="item-admin">
                <span className="item-hora">{formatarHora(ag.inicio)}</span>
                <div className="item-pessoa">
                  <strong>{ag.nome}</strong>
                  <span className={`etiqueta ${ag.status}`}>
                    {ag.status === 'confirmado' ? 'Pago' : 'Aguardando pagamento'}
                  </span>
                  <div className="acoes-admin">
                    <a href={`https://wa.me/${ag.telefone}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                    <span className="item-email">{ag.email}</span>
                  </div>
                </div>
                {confirmando === ag.id ? (
                  <div className="confirmar-cancelar">
                    <button type="button" className="link-botao" onClick={() => cancelar(ag)}>
                      Confirmar cancelamento
                    </button>
                    <button type="button" className="botao-texto" onClick={() => setConfirmando(null)}>
                      Manter
                    </button>
                  </div>
                ) : (
                  <button type="button" className="botao-texto" onClick={() => setConfirmando(ag.id)}>
                    Cancelar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="aviso pequeno">
        {modoDemo
          ? 'Demonstração: os pacientes listados são fictícios. Os agendamentos que você fizer no site aparecem aqui.'
          : 'Ao cancelar um horário pago, faça a devolução pelo app do Mercado Pago.'}
      </p>
      {!modoDemo && (
        <button type="button" className="botao claro" onClick={() => carregar(senha)}>
          Atualizar
        </button>
      )}
    </section>
  );
}
