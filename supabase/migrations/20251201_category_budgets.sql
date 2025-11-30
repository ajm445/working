-- 카테고리별 예산 테이블 생성
create table if not exists public.category_budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  budget_amount numeric not null,
  currency text not null default 'KRW' check (currency in ('KRW', 'USD', 'JPY')),
  budget_amount_in_krw numeric not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- 사용자당 카테고리별로 하나의 예산만 존재
  unique(user_id, category)
);

-- RLS (Row Level Security) 활성화
alter table public.category_budgets enable row level security;

-- 자신의 예산만 조회 가능
create policy "Users can view own category budgets"
  on public.category_budgets
  for select
  using (auth.uid() = user_id);

-- 자신의 예산만 생성 가능
create policy "Users can create own category budgets"
  on public.category_budgets
  for insert
  with check (auth.uid() = user_id);

-- 자신의 예산만 수정 가능
create policy "Users can update own category budgets"
  on public.category_budgets
  for update
  using (auth.uid() = user_id);

-- 자신의 예산만 삭제 가능
create policy "Users can delete own category budgets"
  on public.category_budgets
  for delete
  using (auth.uid() = user_id);

-- updated_at 자동 업데이트 트리거
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.category_budgets
  for each row
  execute function public.handle_updated_at();

-- 인덱스 생성
create index if not exists category_budgets_user_id_idx on public.category_budgets(user_id);
create index if not exists category_budgets_category_idx on public.category_budgets(category);
