# Agenda de Consultas

Site de agendamento online para profissionais de saúde (feito para psicólogas, mas serve para qualquer atendimento com horário marcado).

**O que ele faz**

- Mostra os dias e horários livres e deixa o paciente escolher.
- **Impede dois agendamentos no mesmo horário.** Quem garante é o próprio banco de dados, mesmo que duas pessoas cliquem no mesmo segundo.
- Cobra pelo **Mercado Pago** (Pix, cartão e boleto). O horário fica reservado enquanto o paciente paga e é liberado se ele não pagar no prazo.
- Envia **e-mail de confirmação** ao paciente e um aviso à profissional.
- Envia **lembrete por e-mail e WhatsApp** no dia anterior à consulta.
- Tem um **painel** em `/admin` para a profissional ver e cancelar agendamentos.

**Quanto custa manter:** nenhum serviço cobra mensalidade. Há só as taxas por uso: a do Mercado Pago sobre cada pagamento e a da Meta sobre cada lembrete de WhatsApp (alguns centavos).

---

## Como colocar no ar (passo a passo)

Siga na ordem. Anote cada chave num bloco de notas: você vai usar todas no passo 4.

### 1. Banco de dados: Supabase

1. Entre em [supabase.com](https://supabase.com) e clique em **New project**.
2. Dê um nome (ex.: `agenda`), crie uma senha forte para o banco e escolha a região **South America (São Paulo)**.
3. Quando o projeto terminar de criar, abra **SQL Editor** no menu da esquerda.
4. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) aqui no GitHub, copie **tudo**, cole no SQL Editor e clique em **Run**. Deve aparecer "Success".
5. Vá em **Project Settings → API Keys** e anote:
   - a **Project URL** (parece `https://abcdefgh.supabase.co`) → vira `SUPABASE_URL`
   - a **Secret key** (começa com `sb_secret_`) → vira `SUPABASE_SECRET_KEY`

> ⚠️ A secret key dá acesso total aos dados dos pacientes. Nunca a coloque no código nem mande para ninguém.

### 2. E-mails: Brevo (300 e-mails por dia grátis)

1. Crie uma conta em [brevo.com](https://www.brevo.com).
2. Vá em **Senders, Domains & Dedicated IPs → Senders → Add a sender** e cadastre o e-mail que vai enviar as mensagens (pode ser um Gmail da profissional). Confirme pelo link que chega na caixa de entrada.
   - Esse e-mail vira `EMAIL_REMETENTE`.
3. Vá em **SMTP & API → API Keys → Generate a new API key** e anote → vira `BREVO_API_KEY`.

> Dica: com um domínio próprio (ex.: `dranome.com.br`, cerca de R$ 40 por ano) os e-mails caem menos no spam. Dá para fazer isso depois.

### 3. Hospedagem: Netlify

1. Entre em [netlify.com](https://www.netlify.com) com a sua conta do GitHub.
2. Clique em **Add new project → Import an existing project → GitHub** e escolha o repositório `agenda-consultas`.
3. Antes de publicar, ainda na mesma tela, abra **Environment variables** e cadastre as variáveis do passo 4.
4. Clique em **Deploy**. Em alguns minutos o site fica no ar num endereço como `https://nome-aleatorio.netlify.app`. Você pode trocar o nome em **Project configuration → Change project name**.

### 4. Variáveis de ambiente

Na Netlify: **Project configuration → Environment variables → Add a variable**.

| Variável | O que colocar | Obrigatória? |
|---|---|---|
| `SUPABASE_URL` | Project URL do Supabase | ✅ |
| `SUPABASE_SECRET_KEY` | Secret key do Supabase | ✅ |
| `ADMIN_SENHA` | Senha do painel `/admin` (mínimo 8 caracteres, use uma forte) | ✅ |
| `CRON_SECRET` | Uma sequência aleatória e comprida de letras e números (30 ou mais), inventada por você | ✅ |
| `BREVO_API_KEY` | Chave da Brevo | ✅ para e-mails |
| `EMAIL_REMETENTE` | E-mail verificado na Brevo | ✅ para e-mails |
| `EMAIL_PROFISSIONAL` | E-mail onde a profissional recebe os avisos de novo agendamento | recomendado |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token do Mercado Pago (passo 6) | só para cobrar |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE` | Dados da API do WhatsApp (passo 7) | opcional |
| `SITE_URL` | Só se usar domínio próprio, ex.: `https://www.dranome.com.br` | opcional |

Depois de mudar qualquer variável, vá em **Deploys → Trigger deploy → Deploy project** para o site passar a usar o valor novo.

**Sem `MERCADOPAGO_ACCESS_TOKEN`, o site confirma os agendamentos sem cobrar.** Isso serve para testar tudo antes de ligar o pagamento.

### 5. Lembretes diários (GitHub Actions)

O GitHub chama o site todo dia às 9h para enviar os lembretes das consultas de amanhã.

1. Aqui no repositório, vá em **Settings → Secrets and variables → Actions → New repository secret** e crie:
   - `SITE_URL` = endereço do site (ex.: `https://agenda-dranome.netlify.app`)
   - `CRON_SECRET` = **o mesmo** texto que você colocou na Netlify
2. Para testar na hora: aba **Actions → Lembretes diários → Run workflow**. Se ficar verde, funcionou.

Essa chamada diária também impede que o Supabase gratuito pause o banco por falta de uso.

### 6. Pagamento: Mercado Pago

**Teste primeiro, com dinheiro de mentira:**

1. Entre em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) → **Suas integrações → Criar aplicação** (tipo: pagamentos online, Checkout Pro).
2. Em **Credenciais de teste**, copie o **Access Token** (começa com `TEST-` ou `APP_USR-`) e cadastre como `MERCADOPAGO_ACCESS_TOKEN` na Netlify.
3. Faça um agendamento no site e pague com um [cartão de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards) do Mercado Pago.
4. O agendamento deve aparecer como **confirmado** no `/admin` e o e-mail de confirmação deve chegar.

**Para valer:** faça a mesma coisa **na conta Mercado Pago da profissional** (o dinheiro cai na conta dela), use as **Credenciais de produção** e troque a variável.

### 7. WhatsApp (opcional, por último)

Usa a API oficial da Meta, que cobra alguns centavos por lembrete. Evite serviços "não oficiais": o número pode ser banido.

1. Em [developers.facebook.com](https://developers.facebook.com), crie um app do tipo **Business** e adicione o produto **WhatsApp**.
2. Cadastre o número que vai enviar (não pode ser um número que já está em uso no app do WhatsApp).
3. Crie um **modelo de mensagem** da categoria **Utilidade**, idioma **Português (BR)**, chamado `lembrete_horario`, com este texto:
   > Olá, {{1}}! Passando para lembrar do seu horário: {{2}}, às {{3}}. Se precisar remarcar, responda esta mensagem.
4. Quando o modelo for aprovado, cadastre na Netlify:
   - `WHATSAPP_TOKEN`: um token permanente (de um "usuário do sistema" no Gerenciador de Negócios)
   - `WHATSAPP_PHONE_NUMBER_ID`: o "Phone number ID" que aparece na tela da API
   - `WHATSAPP_TEMPLATE`: `lembrete_horario`

---

## Personalizar

Tudo que muda de profissional para profissional fica em [`site.config.js`](site.config.js): nome, CRP, valor, duração da sessão, horários de cada dia da semana e feriados. Dá para editar direto no GitHub: abra o arquivo e clique no ícone de lápis. A Netlify publica a mudança sozinha em 1 ou 2 minutos.

Revise também o texto da política de privacidade em `app/privacidade/page.js`.

## Cuidados (LGPD)

- O site pede só nome, e-mail, WhatsApp e horário. **Não acrescente campos sobre saúde ou motivo da consulta.**
- As mensagens são neutras de propósito: não dizem "terapia" nem "psicóloga", porque outras pessoas podem ver a tela do celular do paciente.
- Os dados ficam no Supabase com acesso público bloqueado. Só o servidor do site, com a secret key, consegue ler.

## Rodar no seu notebook (opcional)

```bash
npm install
cp .env.example .env.local   # e preencha as chaves
npm run dev                  # abre em http://localhost:3000
npm test                     # testa a lógica de horários
```

## Como o código está organizado

```
site.config.js            ← configurações da profissional
supabase/schema.sql       ← banco de dados e a regra anti-duplicidade
app/page.js               ← página de agendamento
components/Agendamento.js ← escolha de dia, horário e formulário
app/admin/                ← painel da profissional
app/api/horarios          ← lista horários livres
app/api/agendar           ← reserva o horário e gera o pagamento
app/api/webhook/mercadopago ← recebe a confirmação de pagamento
app/api/cron/lembretes    ← envia os lembretes de amanhã
lib/                      ← e-mail, WhatsApp, Mercado Pago, banco, datas
.github/workflows/        ← agendador diário dos lembretes
```
