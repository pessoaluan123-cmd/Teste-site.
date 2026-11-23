import siteConfig from '../site.config.js';

// Modelo básico. Peça para a profissional revisar (e, se possível, um advogado).
export default function TextoPrivacidade({ linkInicio = '/' }) {
  return (
    <section className="faixa">
      <article className="texto-legal">
        <h1>Política de privacidade</h1>
        <p>
          Esta página explica como {siteConfig.nomeProfissional} ({siteConfig.registro}) trata os seus dados neste site de
          agendamento, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <h2>Quais dados coletamos</h2>
        <p>
          Apenas nome, e-mail, número de WhatsApp e o dia e horário escolhidos. Não pedimos, neste site, nenhuma
          informação sobre sua saúde ou o motivo da consulta.
        </p>

        <h2>Para que usamos</h2>
        <p>
          Para registrar o agendamento, processar o pagamento, enviar a confirmação e um lembrete antes da sessão. Não
          usamos seus dados para publicidade e não os vendemos.
        </p>

        <h2>Com quem compartilhamos</h2>
        <p>
          Somente com os serviços necessários para o site funcionar: processador de pagamento (Mercado Pago),
          armazenamento dos agendamentos (Supabase), envio de e-mails (Brevo), envio de lembretes (WhatsApp/Meta) e
          hospedagem do site.
        </p>

        <h2>Por quanto tempo guardamos</h2>
        <p>Pelo tempo necessário para o atendimento e para cumprir obrigações legais e fiscais.</p>

        <h2>Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail{' '}
          <a href={`mailto:${siteConfig.emailContato}`}>{siteConfig.emailContato}</a>.
        </p>

        <a className="botao claro" href={linkInicio}>
          Voltar ao site
        </a>
      </article>
    </section>
  );
}
