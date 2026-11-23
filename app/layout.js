import { Figtree, Fraunces } from 'next/font/google';
import './globals.css';
import siteConfig from '../site.config.js';
import { modoDemo } from '../lib/modo.js';
import { BannerDemo, Cabecalho, Rodape } from '../components/Estrutura.js';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['600'], variable: '--font-fraunces', display: 'swap' });
const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-figtree', display: 'swap' });

export const metadata = {
  title: `${siteConfig.nomeProfissional} | ${siteConfig.titulo}`,
  description: siteConfig.descricao,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f3a5f',
};

export default function Layout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        {modoDemo() && <BannerDemo />}
        <Cabecalho />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
