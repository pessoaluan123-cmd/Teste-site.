import siteConfig from '../site.config.js';
import { diasDisponiveis } from '../lib/horarios.js';
import { formatarDinheiro } from '../lib/formatar.js';
import { pagamentoAtivo } from '../lib/mercadopago.js';
import Agendamento from '../components/Agendamento.js';

// Recalcula a cada visita, para os dias estarem sempre atualizados
export const dynamic = 'force-dynamic';

export default function Inicio() {
  return (
    <>
      <header className="cabecalho">
        <h1>{siteConfig.nomeProfissional}</h1>
        <p>{siteConfig.registro}</p>
        <p>{siteConfig.descricao}</p>
        <span className="selo">
          Sessão de {siteConfig.duracaoMinutos} min · {formatarDinheiro(siteConfig.valorConsulta)}
        </span>
      </header>

      <Agendamento
        dias={diasDisponiveis(siteConfig)}
        valor={formatarDinheiro(siteConfig.valorConsulta)}
        comPagamento={pagamentoAtivo()}
        minutosParaPagar={siteConfig.minutosParaPagar}
      />
    </>
  );
}
