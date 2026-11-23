import './globals.css';
import siteConfig from '../site.config.js';

export const metadata = {
  title: `Agendamento | ${siteConfig.nomeProfissional}`,
  description: siteConfig.descricao,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f7a68',
};

export default function Layout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="pagina">{children}</main>
        <footer className="rodape">
          {siteConfig.nomeProfissional} · {siteConfig.registro} · <a href="/privacidade">Privacidade</a>
        </footer>
      </body>
    </html>
  );
}
