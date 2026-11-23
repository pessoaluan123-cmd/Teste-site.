// Versão do site para o GitHub Pages (modo demonstração, sem servidor).
// Gerada pelo comando: npm run pagina
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BannerDemo, Cabecalho, Rodape } from '../components/Estrutura.js';
import PaginaInicial from '../components/PaginaInicial.js';
import PainelAdmin from '../components/PainelAdmin.js';
import TextoPrivacidade from '../components/TextoPrivacidade.js';

const INICIO = './';

function telaAtual() {
  const hash = window.location.hash.replace('#', '');
  return hash === 'painel' || hash === 'privacidade' ? hash : 'inicio';
}

function App() {
  const [tela, setTela] = useState(telaAtual);

  useEffect(() => {
    const aoMudar = () => {
      const nova = telaAtual();
      setTela((antiga) => {
        if (antiga !== nova) window.scrollTo(0, 0);
        return nova;
      });
    };
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  return (
    <>
      <BannerDemo />
      <Cabecalho inicio={INICIO} />
      <main>
        {tela === 'painel' && <PainelAdmin modoDemo linkInicio={INICIO} />}
        {tela === 'privacidade' && <TextoPrivacidade linkInicio={INICIO} />}
        {tela === 'inicio' && (
          <PaginaInicial modoDemo links={{ painel: '#painel', privacidade: '#privacidade' }} />
        )}
      </main>
      <Rodape privacidade="#privacidade" painel="#painel" />
    </>
  );
}

createRoot(document.getElementById('app')).render(<App />);
