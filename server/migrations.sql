create table if not exists tokens (
  id int primary key default 1,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists transfers (
  id uuid primary key,
  from_account_id text not null,
  to_routing text not null,
  to_account text not null,
  amount_cents bigint not null check (amount_cents > 0),
  memo text,
  status text not null default 'submitted',
  bank_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transfers_status_idx on transfers(status);

