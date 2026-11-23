import siteConfig from '../site.config.js';

export function BannerDemo() {
  return (
    <div className="banner-demo">
      Demonstração: profissional e dados fictícios. Nenhum pagamento é cobrado.
    </div>
  );
}

export function Cabecalho({ inicio = '/' }) {
  return (
    <header className="topo">
      <a className="marca" href={inicio}>
        <span className="marca-nome">{siteConfig.nomeProfissional}</span>
        <span className="marca-titulo">{siteConfig.titulo}</span>
      </a>
      <nav className="menu" aria-label="Seções">
        <a href={`${inicio}#sobre`}>Sobre</a>
        <a href={`${inicio}#como-funciona`}>Como funciona</a>
        <a href={`${inicio}#duvidas`}>Dúvidas</a>
      </nav>
      <a className="botao pequeno" href={`${inicio}#agendar`}>
        Agendar
      </a>
    </header>
  );
}

export function Rodape({ privacidade = '/privacidade', painel = '/admin' }) {
  return (
    <footer className="rodape">
      <div className="rodape-grade">
        <div>
          <p className="rodape-nome">{siteConfig.nomeProfissional}</p>
          <p>
            {siteConfig.titulo} · {siteConfig.registro}
          </p>
        </div>
        <div>
          <p className="rodape-rotulo">Contato</p>
          <p>
            <a href={`mailto:${siteConfig.emailContato}`}>{siteConfig.emailContato}</a>
            <br />
            {siteConfig.telefoneContato}
          </p>
        </div>
        <div>
          <p className="rodape-rotulo">Atendimento</p>
          <p>
            {[siteConfig.atendimentoOnline && 'Online', siteConfig.atendimentoPresencial && 'Presencial']
              .filter(Boolean)
              .join(' e ')}
            {siteConfig.atendimentoPresencial && (
              <>
                <br />
                {siteConfig.endereco}
              </>
            )}
          </p>
        </div>
      </div>
      <p className="rodape-links">
        <a href={privacidade}>Política de privacidade</a>
        <a href={painel}>Área da profissional</a>
      </p>
    </footer>
  );
}
