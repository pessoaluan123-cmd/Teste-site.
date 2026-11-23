import siteConfig from '../site.config.js';
import { diasDisponiveis } from '../lib/horarios.js';
import { pagamentoAtivo } from '../lib/mercadopago.js';
import { modoDemo } from '../lib/modo.js';
import PaginaInicial from '../components/PaginaInicial.js';

// Recalcula a cada visita, para os dias estarem sempre atualizados
export const dynamic = 'force-dynamic';

export default function Inicio() {
  return (
    <PaginaInicial
      dias={diasDisponiveis(siteConfig)}
      modoDemo={modoDemo()}
      comPagamento={pagamentoAtivo()}
    />
  );
}
