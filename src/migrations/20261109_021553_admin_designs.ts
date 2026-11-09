import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_admin_skin" AS ENUM('studio', 'midnight', 'estate', 'essential');
  ALTER TABLE "users" ADD COLUMN "admin_skin" "enum_users_admin_skin" DEFAULT 'studio';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "admin_skin";
  DROP TYPE "public"."enum_users_admin_skin";`)
}
