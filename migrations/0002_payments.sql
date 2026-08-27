create table if not exists payments (
  id uuid primary key,
  correlation_id uuid not null unique,
  amount numeric(18, 2) not null,
  currency text not null,
  account_id uuid not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  failure_reason text
);

create unique index if not exists payments_correlation_id_idx on payments (correlation_id);

insert into payments (
  id, correlation_id, amount, currency, account_id, status, created_at, updated_at, failure_reason
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    150.00,
    'USD',
    '44444444-4444-4444-4444-444444444444',
    'Pending',
    now() - interval '2 hours',
    null,
    null
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    2400.00,
    'EUR',
    '55555555-5555-5555-5555-555555555555',
    'Completed',
    now() - interval '1 day',
    now() - interval '23 hours',
    null
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    89.50,
    'GBP',
    '66666666-6666-6666-6666-666666666666',
    'Failed',
    now() - interval '3 days',
    now() - interval '3 days',
    'Insufficient funds'
  )
on conflict (id) do nothing;
