export const metadata = { title: 'Pagamento não concluído' };

export default function Erro() {
  return (
    <section className="faixa">
      <div className="pagina-aviso">
        <h1>O pagamento não foi concluído</h1>
        <p>Nenhum valor foi cobrado. Você pode tentar de novo escolhendo um horário.</p>
        <a className="botao" href="/#agendar">
          Tentar novamente
        </a>
      </div>
    </section>
  );
}
