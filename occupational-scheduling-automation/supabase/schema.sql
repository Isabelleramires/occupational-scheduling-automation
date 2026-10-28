-- ESQUEMA DEMONSTRATIVO. Não contém dados de funcionários, pacientes ou empresas reais.
-- Execute somente em um projeto isolado, criado especificamente para testes.
create table if not exists public.demo_convocations (
  id text primary key check (id ~ '^DEMO-[A-Z0-9-]{3,40}$'),
  exam_type text not null,
  unit_label text not null,
  status text not null default 'pendente' check (status in ('pendente', 'agendado')),
  created_at timestamptz not null default now()
);

create table if not exists public.demo_appointments (
  id bigint generated always as identity primary key,
  convocation_id text not null unique references public.demo_convocations(id) on delete cascade,
  demo_clinic_id text not null,
  appointment_date date not null,
  appointment_time time not null,
  updated_at timestamptz not null default now()
);

-- Sem políticas de acesso público: anon e authenticated não podem acessar as tabelas.
alter table public.demo_convocations enable row level security;
alter table public.demo_appointments enable row level security;
revoke all on public.demo_convocations from anon, authenticated;
revoke all on public.demo_appointments from anon, authenticated;
