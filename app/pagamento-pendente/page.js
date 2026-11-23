import siteConfig from '../../site.config.js';

export const metadata = { title: 'Aguardando pagamento' };

export default function PagamentoPendente() {
  return (
    <section className="cartao centro">
      <div className="icone-grande">⏳</div>
      <h2>Aguardando o pagamento</h2>
      <p>
        Seu horário fica reservado por {siteConfig.minutosParaPagar} minutos. Assim que o pagamento for
        aprovado, você recebe a confirmação por e-mail.
      </p>
      <p className="aviso">
        Se o prazo passar sem pagamento, o horário é liberado e você pode agendar de novo.
      </p>
      <a className="botao secundario" href="/">
        Voltar ao início
      </a>
    </section>
  );
}
