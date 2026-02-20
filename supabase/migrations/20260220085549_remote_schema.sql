drop extension if exists "pg_net";


  create table "public"."inventory_alerts" (
    "id" uuid not null,
    "ingredient_id" uuid,
    "ingredient_name" text not null,
    "severity" text not null,
    "message" text not null,
    "resolved" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "resolved_at" timestamp with time zone
      );



  create table "public"."inventory_settings" (
    "id" integer not null default 1,
    "stock_mode" text not null default 'strict'::text,
    "hide_out_of_stock_products" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


CREATE INDEX idx_inventory_alerts_created_at ON public.inventory_alerts USING btree (created_at DESC);

CREATE INDEX idx_inventory_alerts_ingredient_id ON public.inventory_alerts USING btree (ingredient_id);

CREATE INDEX idx_inventory_alerts_resolved ON public.inventory_alerts USING btree (resolved);

CREATE UNIQUE INDEX inventory_alerts_pkey ON public.inventory_alerts USING btree (id);

CREATE UNIQUE INDEX inventory_settings_pkey ON public.inventory_settings USING btree (id);

alter table "public"."inventory_alerts" add constraint "inventory_alerts_pkey" PRIMARY KEY using index "inventory_alerts_pkey";

alter table "public"."inventory_settings" add constraint "inventory_settings_pkey" PRIMARY KEY using index "inventory_settings_pkey";

alter table "public"."inventory_alerts" add constraint "inventory_alerts_ingredient_id_fkey" FOREIGN KEY (ingredient_id) REFERENCES public.inventory_ingredients(id) ON DELETE SET NULL not valid;

alter table "public"."inventory_alerts" validate constraint "inventory_alerts_ingredient_id_fkey";

alter table "public"."inventory_alerts" add constraint "inventory_alerts_severity_check" CHECK ((severity = ANY (ARRAY['warning'::text, 'critical'::text]))) not valid;

alter table "public"."inventory_alerts" validate constraint "inventory_alerts_severity_check";

alter table "public"."inventory_settings" add constraint "inventory_settings_id_check" CHECK ((id = 1)) not valid;

alter table "public"."inventory_settings" validate constraint "inventory_settings_id_check";

alter table "public"."inventory_settings" add constraint "inventory_settings_stock_mode_check" CHECK ((stock_mode = ANY (ARRAY['strict'::text, 'flex'::text]))) not valid;

alter table "public"."inventory_settings" validate constraint "inventory_settings_stock_mode_check";

grant delete on table "public"."inventory_alerts" to "anon";

grant insert on table "public"."inventory_alerts" to "anon";

grant references on table "public"."inventory_alerts" to "anon";

grant select on table "public"."inventory_alerts" to "anon";

grant trigger on table "public"."inventory_alerts" to "anon";

grant truncate on table "public"."inventory_alerts" to "anon";

grant update on table "public"."inventory_alerts" to "anon";

grant delete on table "public"."inventory_alerts" to "authenticated";

grant insert on table "public"."inventory_alerts" to "authenticated";

grant references on table "public"."inventory_alerts" to "authenticated";

grant select on table "public"."inventory_alerts" to "authenticated";

grant trigger on table "public"."inventory_alerts" to "authenticated";

grant truncate on table "public"."inventory_alerts" to "authenticated";

grant update on table "public"."inventory_alerts" to "authenticated";

grant delete on table "public"."inventory_alerts" to "service_role";

grant insert on table "public"."inventory_alerts" to "service_role";

grant references on table "public"."inventory_alerts" to "service_role";

grant select on table "public"."inventory_alerts" to "service_role";

grant trigger on table "public"."inventory_alerts" to "service_role";

grant truncate on table "public"."inventory_alerts" to "service_role";

grant update on table "public"."inventory_alerts" to "service_role";

grant delete on table "public"."inventory_settings" to "anon";

grant insert on table "public"."inventory_settings" to "anon";

grant references on table "public"."inventory_settings" to "anon";

grant select on table "public"."inventory_settings" to "anon";

grant trigger on table "public"."inventory_settings" to "anon";

grant truncate on table "public"."inventory_settings" to "anon";

grant update on table "public"."inventory_settings" to "anon";

grant delete on table "public"."inventory_settings" to "authenticated";

grant insert on table "public"."inventory_settings" to "authenticated";

grant references on table "public"."inventory_settings" to "authenticated";

grant select on table "public"."inventory_settings" to "authenticated";

grant trigger on table "public"."inventory_settings" to "authenticated";

grant truncate on table "public"."inventory_settings" to "authenticated";

grant update on table "public"."inventory_settings" to "authenticated";

grant delete on table "public"."inventory_settings" to "service_role";

grant insert on table "public"."inventory_settings" to "service_role";

grant references on table "public"."inventory_settings" to "service_role";

grant select on table "public"."inventory_settings" to "service_role";

grant trigger on table "public"."inventory_settings" to "service_role";

grant truncate on table "public"."inventory_settings" to "service_role";

grant update on table "public"."inventory_settings" to "service_role";

CREATE TRIGGER trg_inventory_settings_updated_at BEFORE UPDATE ON public.inventory_settings FOR EACH ROW EXECUTE FUNCTION public.set_inventory_updated_at();


