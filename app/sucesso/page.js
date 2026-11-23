export const metadata = { title: 'Agendamento recebido' };

export default function Sucesso() {
  return (
    <section className="cartao centro">
      <div className="icone-grande">✅</div>
      <h2>Agendamento recebido!</h2>
      <p>
        Assim que o pagamento for confirmado, você recebe a confirmação por e-mail com a data e o horário.
        No dia anterior, enviamos um lembrete.
      </p>
      <p className="aviso">Não chegou em alguns minutos? Confira a caixa de spam.</p>
      <a className="botao secundario" href="/">
        Voltar ao início
      </a>
    </section>
  );
}
