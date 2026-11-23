import siteConfig from '../../site.config.js';

export const metadata = { title: 'Política de privacidade' };

// Modelo básico. Peça para a profissional revisar (e, se possível, um advogado).
export default function Privacidade() {
  return (
    <section className="cartao texto-legal">
      <h1 style={{ fontSize: 22, marginTop: 0 }}>Política de privacidade</h1>
      <p>
        Esta página explica como {siteConfig.nomeProfissional} ({siteConfig.registro}) trata os seus dados neste
        site de agendamento, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
      </p>

      <h2>Quais dados coletamos</h2>
      <p>
        Apenas nome, e-mail, número de WhatsApp e o dia e horário escolhidos. Não pedimos, neste site, nenhuma
        informação sobre sua saúde ou o motivo da consulta.
      </p>

      <h2>Para que usamos</h2>
      <p>
        Para registrar o agendamento, processar o pagamento, enviar a confirmação e um lembrete antes da sessão.
        Não usamos seus dados para publicidade e não os vendemos.
      </p>

      <h2>Com quem compartilhamos</h2>
      <p>
        Somente com os serviços necessários para o site funcionar: Mercado Pago (pagamento), Supabase
        (armazenamento dos agendamentos), Brevo (envio de e-mails), Meta/WhatsApp (envio de lembretes) e Netlify
        (hospedagem do site).
      </p>

      <h2>Por quanto tempo guardamos</h2>
      <p>Pelo tempo necessário para o atendimento e para cumprir obrigações legais e fiscais.</p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail{' '}
        <a href={`mailto:${siteConfig.emailContato}`}>{siteConfig.emailContato}</a>.
      </p>

      <a className="botao secundario" href="/" style={{ marginTop: 24 }}>
        Voltar ao agendamento
      </a>
    </section>
  );
}
