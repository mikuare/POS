create table if not exists public.receipt_templates (
  id text primary key,
  name text not null unique,
  config_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_receipt_templates_active
  on public.receipt_templates(is_active desc, updated_at desc);

drop trigger if exists trg_receipt_templates_set_updated_at on public.receipt_templates;
create trigger trg_receipt_templates_set_updated_at
before update on public.receipt_templates
for each row
execute function public.set_updated_at();

alter table public.receipt_templates disable row level security;

insert into public.receipt_templates (id, name, config_json, is_active)
values (
  'classic-roast-beef',
  'Classic Official',
  $json$
  {
    "paperWidthMm": 80,
    "paddingPx": 12,
    "borderRadiusPx": 12,
    "fontFamily": "'Trebuchet MS', 'Arial', sans-serif",
    "baseFontSizePx": 13,
    "titleFontSizePx": 24,
    "metaFontSizePx": 12,
    "totalFontSizePx": 16,
    "sectionGapPx": 10,
    "logoUrl": "/Business Logo/Ruels Logo for business.png",
    "showLogo": true,
    "logoWidthPx": 78,
    "headerAlign": "center",
    "footerAlign": "center",
    "backgroundColor": "#ffffff",
    "textColor": "#432716",
    "accentColor": "#5a3521",
    "mutedColor": "#7b5a47",
    "borderColor": "#c8a88f",
    "borderStyle": "dashed",
    "dividerStyle": "dashed",
    "storeName": "Ruel's Roast Beef",
    "storeAddress": "Location : Tres Martires, City of Baybay, 6521 Leyte",
    "taxLine": "Vat Registered TIN 342-231-312-00000",
    "footerMessage": "Thank you for dining with us!"
  }
  $json$::jsonb,
  true
)
on conflict (id) do update
set
  name = excluded.name,
  config_json = excluded.config_json;

with active_exists as (
  select exists(
    select 1
    from public.receipt_templates
    where is_active = true
  ) as has_active
)
update public.receipt_templates
set is_active = case when id = 'classic-roast-beef' then true else false end
where (select not has_active from active_exists);
