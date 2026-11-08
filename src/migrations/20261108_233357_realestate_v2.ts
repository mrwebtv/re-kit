import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_theme" AS ENUM('editorial', 'modern', 'dark', 'swiss');
  CREATE TYPE "public"."enum_site_settings_area_unit" AS ENUM('sqm', 'sqft');
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" "enum_site_settings_theme" DEFAULT 'editorial' NOT NULL,
  	"agency_name" varchar DEFAULT 'Aldridge & Vale' NOT NULL,
  	"tagline" varchar DEFAULT 'Private residences · Sales & lettings',
  	"logo_id" integer,
  	"accent_color" varchar,
  	"hero_headline" varchar DEFAULT 'Homes of rare character.',
  	"hero_text" varchar DEFAULT 'Search every home we sell and let, book viewings online and talk to an agent who knows the area.',
  	"hero_image_id" integer,
  	"sell_image_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"currency_symbol" varchar DEFAULT '$',
  	"currency_code" varchar DEFAULT 'USD',
  	"area_unit" "enum_site_settings_area_unit" DEFAULT 'sqm',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "enquiries" ADD COLUMN "property_address" varchar;
  ALTER TABLE "enquiries" ADD COLUMN "website" varchar;
  ALTER TABLE "viewings" ADD COLUMN "website" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_sell_image_id_media_id_fk" FOREIGN KEY ("sell_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_hero_image_idx" ON "site_settings" USING btree ("hero_image_id");
  CREATE INDEX "site_settings_sell_image_idx" ON "site_settings" USING btree ("sell_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "enquiries" DROP COLUMN "property_address";
  ALTER TABLE "enquiries" DROP COLUMN "website";
  ALTER TABLE "viewings" DROP COLUMN "website";
  DROP TYPE "public"."enum_site_settings_theme";
  DROP TYPE "public"."enum_site_settings_area_unit";`)
}
