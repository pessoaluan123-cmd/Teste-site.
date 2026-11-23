'use client';

import { useState } from 'react';
import { rotuloDia, formatarDataHora } from '../lib/formatar.js';

export default function Agendamento({ dias, valor, comPagamento, minutosParaPagar }) {
  const [dia, setDia] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [escolhido, setEscolhido] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', empresa: '', consentimento: false });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  async function escolherDia(data) {
    setDia(data);
    setEscolhido(null);
    setErro('');
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

  function atualizar(campo) {
    return (e) => {
      const valorCampo = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((atual) => ({ ...atual, [campo]: valorCampo }));
    };
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
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

  if (dias.length === 0) {
    return (
      <section className="cartao centro">
        <p>No momento não há horários abertos para agendamento. Volte em breve!</p>
      </section>
    );
  }

  return (
    <>
      <section className="cartao">
        <h2>
          <span className="passo">1</span>Escolha o dia
        </h2>
        <div className="dias">
          {dias.map((d) => {
            const { semana, dia: rotulo } = rotuloDia(d);
            return (
              <button
                key={d}
                type="button"
                className={`dia ${dia === d ? 'ativo' : ''}`}
                onClick={() => escolherDia(d)}
              >
                <span>{semana}</span>
                <strong>{rotulo}</strong>
              </button>
            );
          })}
        </div>
      </section>

      {dia && (
        <section className="cartao">
          <h2>
            <span className="passo">2</span>Escolha o horário
          </h2>
          {carregando && <p className="aviso">Carregando horários...</p>}
          {!carregando && horarios.length === 0 && (
            <p className="aviso">Nenhum horário livre neste dia. Tente outro dia.</p>
          )}
          <div className="horarios">
            {!carregando &&
              horarios.map((h) => (
                <button
                  key={h.inicio}
                  type="button"
                  className={`horario ${escolhido?.inicio === h.inicio ? 'ativo' : ''}`}
                  onClick={() => setEscolhido(h)}
                >
                  {h.hora}
                </button>
              ))}
          </div>
        </section>
      )}

      {escolhido && (
        <section className="cartao">
          <h2>
            <span className="passo">3</span>Seus dados
          </h2>
          <div className="resumo">
            <strong style={{ textTransform: 'capitalize' }}>{formatarDataHora(escolhido.inicio)}</strong>
            <br />
            Valor: {valor}
          </div>

          <form onSubmit={enviar}>
            <div className="campo">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" required autoComplete="name" value={form.nome} onChange={atualizar('nome')} />
            </div>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={atualizar('email')}
              />
            </div>
            <div className="campo">
              <label htmlFor="telefone">WhatsApp com DDD</label>
              <input
                id="telefone"
                type="tel"
                required
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

            <label className="consentimento">
              <input type="checkbox" required checked={form.consentimento} onChange={atualizar('consentimento')} />
              <span>
                Li e concordo com a <a href="/privacidade" target="_blank">política de privacidade</a>.
              </span>
            </label>

            {erro && <p className="erro">{erro}</p>}

            <button className="botao" type="submit" disabled={enviando}>
              {enviando ? 'Aguarde...' : comPagamento ? `Ir para o pagamento (${valor})` : 'Confirmar agendamento'}
            </button>
            {comPagamento && (
              <p className="aviso centro">
                Pix, cartão ou boleto. O horário fica reservado por {minutosParaPagar} minutos enquanto você paga.
              </p>
            )}
          </form>
        </section>
      )}

      {erro && !escolhido && <p className="erro centro">{erro}</p>}
    </>
  );
}
