create table if not exists public.app_settings (
  key text primary key,
  value_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_app_settings_set_updated_at on public.app_settings;
create trigger trg_app_settings_set_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

alter table public.app_settings disable row level security;

insert into public.app_settings (key, value_json)
values (
  'app_config',
  $json$
  {
    "enforceKitSpec": true,
    "discountProfiles": [
      { "id": "student", "name": "Students", "type": "percent", "amount": 10 },
      { "id": "senior", "name": "Seniors", "type": "percent", "amount": 20 },
      { "id": "pwd", "name": "PWD", "type": "percent", "amount": 20 }
    ],
    "roleAccess": {
      "encharge": [
        "shift_session_access",
        "shift_monitor_access",
        "invoice_action_access"
      ],
      "supervisor": [
        "control_center_access",
        "menu_editor_access",
        "cash_drawer_access",
        "inventory_access",
        "kit_spec_access",
        "user_directory_access",
        "operations_access",
        "receipt_templates_access",
        "reports_access",
        "discounts_access",
        "monthly_closing_access",
        "shift_session_access",
        "shift_monitor_access",
        "invoice_action_access"
      ]
    },
    "ePaymentSettings": {
      "gcash": { "enabled": true, "disabledReason": "" },
      "paymaya": { "enabled": true, "disabledReason": "" },
      "scanQr": { "enabled": true, "disabledReason": "" }
    }
  }
  $json$::jsonb
)
on conflict (key) do nothing;
