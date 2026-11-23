'use client';

import { useEffect, useState } from 'react';
import { formatarDataHora } from '../lib/formatar.js';

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
    // navegador bloqueou o armazenamento: tudo bem, só pede a senha de novo
  }
}

export default function PainelAdmin() {
  const [senha, setSenha] = useState('');
  const [entrou, setEntrou] = useState(false);
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar(senhaUsada) {
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
    const salva = lerSenhaSalva();
    if (salva) {
      setSenha(salva);
      carregar(salva);
    }
  }, []);

  async function cancelar(ag) {
    const ok = window.confirm(
      `Cancelar o horário de ${ag.nome} (${formatarDataHora(ag.inicio)})?\n\n` +
        'O horário volta a ficar livre. Se foi pago, faça a devolução pelo app do Mercado Pago.'
    );
    if (!ok) return;
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
      <section className="cartao">
        <h2>Painel da profissional</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            carregar(senha);
          }}
        >
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button className="botao" type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="cartao">
      <h2>Próximos agendamentos ({lista.length})</h2>
      {erro && <p className="erro">{erro}</p>}
      {lista.length === 0 && <p className="aviso">Nenhum agendamento por enquanto.</p>}
      <ul className="lista-admin">
        {lista.map((ag) => (
          <li key={ag.id} className="item-admin">
            <div className="quando">
              {formatarDataHora(ag.inicio)}
              <span className={`etiqueta ${ag.status}`}>
                {ag.status === 'confirmado' ? 'confirmado' : 'aguardando pagamento'}
              </span>
            </div>
            <div>{ag.nome}</div>
            <div className="acoes-admin">
              <a href={`https://wa.me/${ag.telefone}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a href={`mailto:${ag.email}`}>E-mail</a>
              <button type="button" className="link-botao" onClick={() => cancelar(ag)}>
                Cancelar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="botao secundario"
        style={{ marginTop: 16 }}
        onClick={() => carregar(senha)}
      >
        Atualizar
      </button>
    </section>
  );
}
