-- =====================================================================
-- Banco de dados do site de agendamento
-- Como usar: no Supabase, abra "SQL Editor", cole TODO este arquivo
-- e clique em "Run". Só precisa fazer isso uma vez.
-- =====================================================================

create table if not exists agendamentos (
  id               uuid primary key default gen_random_uuid(),
  nome             text not null,
  email            text not null,
  telefone         text not null,
  inicio           timestamptz not null,
  fim              timestamptz not null,
  -- pendente   = aguardando pagamento
  -- confirmado = pago (ou confirmado sem pagamento)
  -- expirado   = o prazo para pagar acabou
  -- cancelado  = cancelado pela profissional
  status           text not null default 'pendente'
                   check (status in ('pendente', 'confirmado', 'expirado', 'cancelado')),
  expira_em        timestamptz,
  pagamento_id     text,
  lembrete_enviado boolean not null default false,
  criado_em        timestamptz not null default now()
);

-- Dados de pacientes são sensíveis (LGPD): ninguém acessa a tabela
-- diretamente pela internet. Só o servidor do site, com a chave secreta.
alter table agendamentos enable row level security;

-- A REGRA QUE IMPEDE DOIS AGENDAMENTOS NO MESMO HORÁRIO.
-- O próprio banco recusa um segundo agendamento ativo no mesmo início,
-- mesmo que duas pessoas cliquem exatamente no mesmo segundo.
create unique index if not exists um_agendamento_por_horario
  on agendamentos (inicio)
  where status in ('pendente', 'confirmado');

create index if not exists agendamentos_por_inicio on agendamentos (inicio);


-- Reserva um horário. Devolve o id do agendamento, ou null se o horário
-- já estiver ocupado.
create or replace function reservar_horario(
  p_nome text,
  p_email text,
  p_telefone text,
  p_inicio timestamptz,
  p_fim timestamptz,
  p_minutos_reserva int
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_id uuid;
begin
  -- Libera reservas antigas desse horário que não foram pagas a tempo
  update agendamentos
     set status = 'expirado'
   where inicio = p_inicio
     and status = 'pendente'
     and expira_em < now();

  insert into agendamentos (nome, email, telefone, inicio, fim, status, expira_em)
  values (p_nome, p_email, p_telefone, p_inicio, p_fim, 'pendente',
          now() + make_interval(mins => p_minutos_reserva))
  returning id into novo_id;

  return novo_id;
exception
  when unique_violation then
    return null; -- alguém já está com esse horário
end;
$$;


-- Confirma um agendamento depois do pagamento aprovado.
-- Devolve: 'confirmado', 'ja_confirmado', 'cancelado', 'conflito' ou 'nao_encontrado'
create or replace function confirmar_agendamento(p_id uuid, p_pagamento_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  atual text;
begin
  select status into atual from agendamentos where id = p_id for update;

  if atual is null then
    return 'nao_encontrado';
  elsif atual = 'confirmado' then
    return 'ja_confirmado';
  elsif atual = 'cancelado' then
    return 'cancelado';
  end if;

  update agendamentos
     set status = 'confirmado',
         pagamento_id = p_pagamento_id,
         expira_em = null
   where id = p_id;

  return 'confirmado';
exception
  when unique_violation then
    -- O pagamento chegou depois do prazo e outra pessoa já pegou o horário
    return 'conflito';
end;
$$;


-- Lista os horários ocupados num intervalo (sem dados pessoais).
create or replace function horarios_ocupados(p_de timestamptz, p_ate timestamptz)
returns table (horario timestamptz)
language sql
security definer
set search_path = public
as $$
  select a.inicio
    from agendamentos a
   where a.inicio >= p_de
     and a.inicio < p_ate
     and (a.status = 'confirmado' or (a.status = 'pendente' and a.expira_em > now()));
$$;


-- Só o servidor do site (chave secreta) pode usar essas funções.
revoke execute on function reservar_horario(text, text, text, timestamptz, timestamptz, int) from public, anon, authenticated;
revoke execute on function confirmar_agendamento(uuid, text) from public, anon, authenticated;
revoke execute on function horarios_ocupados(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function reservar_horario(text, text, text, timestamptz, timestamptz, int) to service_role;
grant execute on function confirmar_agendamento(uuid, text) to service_role;
grant execute on function horarios_ocupados(timestamptz, timestamptz) to service_role;
