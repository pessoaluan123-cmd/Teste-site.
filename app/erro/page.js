export const metadata = { title: 'Pagamento não concluído' };

export default function Erro() {
  return (
    <section className="cartao centro">
      <div className="icone-grande">⚠️</div>
      <h2>O pagamento não foi concluído</h2>
      <p>Nenhum valor foi cobrado. Você pode tentar de novo escolhendo um horário.</p>
      <a className="botao" href="/">
        Tentar novamente
      </a>
    </section>
  );
}
