import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "colors_primary" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_on_primary" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_secondary" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_on_secondary" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_muted" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_background" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_surface" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "colors_border" varchar;
  UPDATE "site_settings" SET "colors_primary" = "accent_color" WHERE "accent_color" IS NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "colors_primary";
  ALTER TABLE "site_settings" DROP COLUMN "colors_on_primary";
  ALTER TABLE "site_settings" DROP COLUMN "colors_secondary";
  ALTER TABLE "site_settings" DROP COLUMN "colors_on_secondary";
  ALTER TABLE "site_settings" DROP COLUMN "colors_text";
  ALTER TABLE "site_settings" DROP COLUMN "colors_muted";
  ALTER TABLE "site_settings" DROP COLUMN "colors_background";
  ALTER TABLE "site_settings" DROP COLUMN "colors_surface";
  ALTER TABLE "site_settings" DROP COLUMN "colors_border";`)
}
