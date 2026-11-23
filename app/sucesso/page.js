export const metadata = { title: 'Agendamento recebido' };

export default function Sucesso() {
  return (
    <section className="faixa">
      <div className="pagina-aviso">
        <svg className="selo-ok" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#e8664a" />
          <path d="M14 25 l7 7 l13 -15" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1>Agendamento recebido</h1>
        <p>
          Assim que o pagamento for confirmado, você recebe a confirmação por e-mail com a data e o horário. No dia
          anterior, enviamos um lembrete.
        </p>
        <p className="aviso">Não chegou em alguns minutos? Confira a caixa de spam.</p>
        <a className="botao claro" href="/">
          Voltar ao início
        </a>
      </div>
    </section>
  );
}
