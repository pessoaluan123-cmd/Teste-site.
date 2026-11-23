import siteConfig from '../../site.config.js';

export const metadata = { title: 'Aguardando pagamento' };

export default function PagamentoPendente() {
  return (
    <section className="faixa">
      <div className="pagina-aviso">
        <h1>Aguardando o pagamento</h1>
        <p>
          Seu horário fica reservado por {siteConfig.minutosParaPagar} minutos. Assim que o pagamento for aprovado, você
          recebe a confirmação por e-mail.
        </p>
        <p className="aviso">Se o prazo passar sem pagamento, o horário é liberado e você pode agendar de novo.</p>
        <a className="botao claro" href="/">
          Voltar ao início
        </a>
      </div>
    </section>
  );
}
