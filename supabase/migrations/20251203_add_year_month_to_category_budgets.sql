-- 카테고리 예산 테이블에 year, month 필드 추가하여 월별 예산 관리 가능하도록 변경

-- 1. unique constraint 제거 (user_id, category) -> (user_id, category, year, month)로 변경 예정
alter table public.category_budgets
  drop constraint if exists category_budgets_user_id_category_key;

-- 2. year, month 컬럼 추가
alter table public.category_budgets
  add column if not exists year integer,
  add column if not exists month integer check (month >= 1 and month <= 12);

-- 3. 기존 데이터에 현재 년/월 설정 (기존 데이터가 있을 경우)
update public.category_budgets
set
  year = extract(year from created_at),
  month = extract(month from created_at)
where year is null or month is null;

-- 4. year, month를 NOT NULL로 변경
alter table public.category_budgets
  alter column year set not null,
  alter column month set not null;

-- 5. 새로운 unique constraint 추가 (사용자당 카테고리별, 년월별로 하나의 예산만 존재)
alter table public.category_budgets
  add constraint category_budgets_user_category_year_month_key
  unique(user_id, category, year, month);

-- 6. year, month 인덱스 추가 (조회 성능 향상)
create index if not exists category_budgets_year_month_idx
  on public.category_budgets(year, month);

create index if not exists category_budgets_user_year_month_idx
  on public.category_budgets(user_id, year, month);

-- 7. 주석 추가
comment on column public.category_budgets.year is '예산 적용 년도 (예: 2025)';
comment on column public.category_budgets.month is '예산 적용 월 (1-12)';
