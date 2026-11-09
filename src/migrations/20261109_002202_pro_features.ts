import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_price_qualifier" AS ENUM('offers-over', 'offers-in-the-region-of', 'guide-price', 'from', 'fixed-price', 'asking-price');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'agent');
  CREATE TYPE "public"."enum_site_settings_features_analytics_provider" AS ENUM('plausible', 'umami', 'ga4');
  CREATE TABLE "properties_open_houses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start" timestamp(3) with time zone NOT NULL,
  	"end" timestamp(3) with time zone
  );
  
  CREATE TABLE "search_alerts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"filters" jsonb,
  	"summary" varchar,
  	"active" boolean DEFAULT true,
  	"consent" boolean,
  	"last_sent_at" timestamp(3) with time zone,
  	"token" varchar,
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "properties" ADD COLUMN "price_qualifier" "enum_properties_price_qualifier";
  ALTER TABLE "properties" ADD COLUMN "tour_url" varchar;
  ALTER TABLE "properties" ADD COLUMN "brochure_id" integer;
  ALTER TABLE "enquiries" ADD COLUMN "consent" boolean;
  ALTER TABLE "enquiries" ADD COLUMN "consent_at" timestamp(3) with time zone;
  ALTER TABLE "viewings" ADD COLUMN "consent" boolean;
  ALTER TABLE "viewings" ADD COLUMN "consent_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'agent' NOT NULL;
  -- Accounts that existed before roles keep full access.
  UPDATE "users" SET "role" = 'admin';
  ALTER TABLE "users" ADD COLUMN "agent_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_alerts_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "favicon_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "brochure_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "brochure_footer" varchar DEFAULT 'Particulars are for guidance only and do not form part of any contract.';
  ALTER TABLE "site_settings" ADD COLUMN "smtp_host" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "smtp_port" numeric DEFAULT 465;
  ALTER TABLE "site_settings" ADD COLUMN "smtp_user" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "smtp_pass" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "email_from" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "leads_inbox" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "copy_all_leads" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "og_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "noindex" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "company_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_policy" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "consent_text" varchar DEFAULT 'I agree to my details being used to answer this request, as set out in the privacy policy.';
  ALTER TABLE "site_settings" ADD COLUMN "show_credit" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "credit_text" varchar DEFAULT 'Website by Mr Web';
  ALTER TABLE "site_settings" ADD COLUMN "credit_url" varchar DEFAULT 'https://mrweb.tv';
  ALTER TABLE "site_settings" ADD COLUMN "features_video_tours" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_open_houses" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_mortgage_calculator" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_mortgage_rate" numeric DEFAULT 4.5;
  ALTER TABLE "site_settings" ADD COLUMN "features_mortgage_years" numeric DEFAULT 30;
  ALTER TABLE "site_settings" ADD COLUMN "features_mortgage_deposit" numeric DEFAULT 10;
  ALTER TABLE "site_settings" ADD COLUMN "features_search_alerts" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_crm_webhook" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_webhook_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_property_feed" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_analytics" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_analytics_provider" "enum_site_settings_features_analytics_provider" DEFAULT 'plausible';
  ALTER TABLE "site_settings" ADD COLUMN "features_analytics_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_analytics_src" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_error_alerts" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_error_alert_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_lead_retention" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_lead_retention_months" numeric DEFAULT 24;
  ALTER TABLE "properties_open_houses" ADD CONSTRAINT "properties_open_houses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_open_houses_order_idx" ON "properties_open_houses" USING btree ("_order");
  CREATE INDEX "properties_open_houses_parent_id_idx" ON "properties_open_houses" USING btree ("_parent_id");
  CREATE INDEX "search_alerts_token_idx" ON "search_alerts" USING btree ("token");
  CREATE INDEX "search_alerts_updated_at_idx" ON "search_alerts" USING btree ("updated_at");
  CREATE INDEX "search_alerts_created_at_idx" ON "search_alerts" USING btree ("created_at");
  ALTER TABLE "properties" ADD CONSTRAINT "properties_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_alerts_fk" FOREIGN KEY ("search_alerts_id") REFERENCES "public"."search_alerts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "properties_brochure_idx" ON "properties" USING btree ("brochure_id");
  CREATE INDEX "users_agent_idx" ON "users" USING btree ("agent_id");
  CREATE INDEX "payload_locked_documents_rels_search_alerts_id_idx" ON "payload_locked_documents_rels" USING btree ("search_alerts_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_og_image_idx" ON "site_settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties_open_houses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_alerts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "properties_open_houses" CASCADE;
  DROP TABLE "search_alerts" CASCADE;
  ALTER TABLE "properties" DROP CONSTRAINT "properties_brochure_id_media_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_agent_id_agents_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_search_alerts_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_favicon_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_og_image_id_media_id_fk";
  
  DROP INDEX "properties_brochure_idx";
  DROP INDEX "users_agent_idx";
  DROP INDEX "payload_locked_documents_rels_search_alerts_id_idx";
  DROP INDEX "site_settings_favicon_idx";
  DROP INDEX "site_settings_og_image_idx";
  ALTER TABLE "properties" DROP COLUMN "price_qualifier";
  ALTER TABLE "properties" DROP COLUMN "tour_url";
  ALTER TABLE "properties" DROP COLUMN "brochure_id";
  ALTER TABLE "enquiries" DROP COLUMN "consent";
  ALTER TABLE "enquiries" DROP COLUMN "consent_at";
  ALTER TABLE "viewings" DROP COLUMN "consent";
  ALTER TABLE "viewings" DROP COLUMN "consent_at";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "agent_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_alerts_id";
  ALTER TABLE "site_settings" DROP COLUMN "favicon_id";
  ALTER TABLE "site_settings" DROP COLUMN "brochure_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "brochure_footer";
  ALTER TABLE "site_settings" DROP COLUMN "smtp_host";
  ALTER TABLE "site_settings" DROP COLUMN "smtp_port";
  ALTER TABLE "site_settings" DROP COLUMN "smtp_user";
  ALTER TABLE "site_settings" DROP COLUMN "smtp_pass";
  ALTER TABLE "site_settings" DROP COLUMN "email_from";
  ALTER TABLE "site_settings" DROP COLUMN "leads_inbox";
  ALTER TABLE "site_settings" DROP COLUMN "copy_all_leads";
  ALTER TABLE "site_settings" DROP COLUMN "meta_description";
  ALTER TABLE "site_settings" DROP COLUMN "og_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "noindex";
  ALTER TABLE "site_settings" DROP COLUMN "company_name";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_policy";
  ALTER TABLE "site_settings" DROP COLUMN "consent_text";
  ALTER TABLE "site_settings" DROP COLUMN "show_credit";
  ALTER TABLE "site_settings" DROP COLUMN "credit_text";
  ALTER TABLE "site_settings" DROP COLUMN "credit_url";
  ALTER TABLE "site_settings" DROP COLUMN "features_video_tours";
  ALTER TABLE "site_settings" DROP COLUMN "features_open_houses";
  ALTER TABLE "site_settings" DROP COLUMN "features_mortgage_calculator";
  ALTER TABLE "site_settings" DROP COLUMN "features_mortgage_rate";
  ALTER TABLE "site_settings" DROP COLUMN "features_mortgage_years";
  ALTER TABLE "site_settings" DROP COLUMN "features_mortgage_deposit";
  ALTER TABLE "site_settings" DROP COLUMN "features_search_alerts";
  ALTER TABLE "site_settings" DROP COLUMN "features_crm_webhook";
  ALTER TABLE "site_settings" DROP COLUMN "features_webhook_url";
  ALTER TABLE "site_settings" DROP COLUMN "features_property_feed";
  ALTER TABLE "site_settings" DROP COLUMN "features_analytics";
  ALTER TABLE "site_settings" DROP COLUMN "features_analytics_provider";
  ALTER TABLE "site_settings" DROP COLUMN "features_analytics_id";
  ALTER TABLE "site_settings" DROP COLUMN "features_analytics_src";
  ALTER TABLE "site_settings" DROP COLUMN "features_error_alerts";
  ALTER TABLE "site_settings" DROP COLUMN "features_error_alert_email";
  ALTER TABLE "site_settings" DROP COLUMN "features_lead_retention";
  ALTER TABLE "site_settings" DROP COLUMN "features_lead_retention_months";
  DROP TYPE "public"."enum_properties_price_qualifier";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_features_analytics_provider";`)
}
