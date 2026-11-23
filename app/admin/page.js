import PainelAdmin from '../../components/PainelAdmin.js';
import { modoDemo } from '../../lib/modo.js';

export const metadata = {
  title: 'Área da profissional',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Admin() {
  return <PainelAdmin modoDemo={modoDemo()} />;
}
