import { DEFAULT_LOCALE } from '../i18n/locales'
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const L = DEFAULT_LOCALE
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ar');
  CREATE TYPE "public"."enum_properties_energy_class" AS ENUM('Aplus', 'A', 'B', 'C', 'D', 'E', 'F', 'G');
  CREATE TYPE "public"."enum_properties_source" AS ENUM('manual', 'mls', 'import');
  CREATE TYPE "public"."enum_property_labels_icon" AS ENUM('check', 'pool', 'garage', 'parking', 'garden', 'sea', 'mountain', 'lift', 'fireplace', 'aircon', 'heating', 'balcony', 'terrace', 'gym', 'wifi', 'pets', 'security', 'solar', 'storage', 'furnished', 'accessible', 'star', 'home', 'calendar', 'ruler', 'bed', 'bath', 'view', 'new');
  CREATE TYPE "public"."enum_property_fields_icon" AS ENUM('check', 'pool', 'garage', 'parking', 'garden', 'sea', 'mountain', 'lift', 'fireplace', 'aircon', 'heating', 'balcony', 'terrace', 'gym', 'wifi', 'pets', 'security', 'solar', 'storage', 'furnished', 'accessible', 'star', 'home', 'calendar', 'ruler', 'bed', 'bath', 'view', 'new');
  CREATE TYPE "public"."enum_deals_stage" AS ENUM('new', 'contacted', 'viewing', 'offer', 'agreed', 'completed', 'lost');
  CREATE TYPE "public"."enum_deals_source" AS ENUM('manual', 'property', 'viewing', 'valuation', 'contact');
  CREATE TYPE "public"."enum_activities_type" AS ENUM('note', 'call', 'email', 'meeting', 'viewing', 'task');
  CREATE TYPE "public"."enum_pages_blocks_hero_style" AS ENUM('image', 'fullscreen', 'split', 'minimal', 'video');
  CREATE TYPE "public"."enum_pages_blocks_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_text_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_image_text_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_property_grid_show" AS ENUM('featured', 'sale', 'rent', 'town', 'label', 'development', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_property_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_search_bar_mode" AS ENUM('buy', 'rent');
  CREATE TYPE "public"."enum_pages_blocks_search_bar_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_agents_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_stats_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_items_icon" AS ENUM('check', 'pool', 'garage', 'parking', 'garden', 'sea', 'mountain', 'lift', 'fireplace', 'aircon', 'heating', 'balcony', 'terrace', 'gym', 'wifi', 'pets', 'security', 'solar', 'storage', 'furnished', 'accessible', 'star', 'home', 'calendar', 'ruler', 'bed', 'bath', 'view', 'new');
  CREATE TYPE "public"."enum_pages_blocks_icon_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_faq_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_form" AS ENUM('contact', 'valuation', 'alert');
  CREATE TYPE "public"."enum_pages_blocks_lead_form_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_latest_posts_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('about', 'sell', 'development', 'area', 'splash');
  CREATE TYPE "public"."enum_pages_chrome" AS ENUM('default', 'transparent', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style" AS ENUM('image', 'fullscreen', 'split', 'minimal', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_text_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_text_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_property_grid_show" AS ENUM('featured', 'sale', 'rent', 'town', 'label', 'development', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_property_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_search_bar_mode" AS ENUM('buy', 'rent');
  CREATE TYPE "public"."enum__pages_v_blocks_search_bar_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_agents_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_grid_items_icon" AS ENUM('check', 'pool', 'garage', 'parking', 'garden', 'sea', 'mountain', 'lift', 'fireplace', 'aircon', 'heating', 'balcony', 'terrace', 'gym', 'wifi', 'pets', 'security', 'solar', 'storage', 'furnished', 'accessible', 'star', 'home', 'calendar', 'ruler', 'bed', 'bath', 'view', 'new');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_grid_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_lead_form_form" AS ENUM('contact', 'valuation', 'alert');
  CREATE TYPE "public"."enum__pages_v_blocks_lead_form_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_latest_posts_background" AS ENUM('default', 'soft', 'dark');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('about', 'sell', 'development', 'area', 'splash');
  CREATE TYPE "public"."enum__pages_v_version_chrome" AS ENUM('default', 'transparent', 'none');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ar');
  CREATE TYPE "public"."enum_posts_template" AS ENUM('market', 'news', 'guide');
  CREATE TYPE "public"."enum__posts_v_version_template" AS ENUM('market', 'news', 'guide');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ar');
  CREATE TYPE "public"."enum_site_settings_viewing_slots_days" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_site_settings_languages" AS ENUM('en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ar');
  CREATE TYPE "public"."enum_site_settings_currencies" AS ENUM('EUR', 'GBP', 'USD', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'JPY', 'CNY', 'HKD', 'SGD', 'INR', 'ZAR', 'AED', 'SAR', 'BRL', 'MXN', 'NZD', 'TRY');
  CREATE TYPE "public"."enum_site_settings_default_view" AS ENUM('map', 'grid', 'list');
  CREATE TYPE "public"."enum_site_settings_mls_provider" AS ENUM('bridge', 'trestle', 'spark', 'mlsgrid', 'reso');
  CREATE TYPE "public"."enum_site_settings_mls_auth" AS ENUM('token', 'oauth');
  CREATE TYPE "public"."enum_site_settings_features_captcha_provider" AS ENUM('turnstile', 'recaptcha');
  ALTER TYPE "public"."enum_properties_property_type" ADD VALUE 'villa' BEFORE 'site';
  ALTER TYPE "public"."enum_properties_property_type" ADD VALUE 'development';
  ALTER TYPE "public"."enum_enquiries_type" ADD VALUE 'signup';
  CREATE TABLE "properties_features_locales" (
  	"feature" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "properties_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_id" integer NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "properties_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE "properties_attachments_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "properties_external_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "properties_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "property_labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar DEFAULT '#1B1B19',
  	"icon" "enum_property_labels_icon",
  	"filterable" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "property_labels_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "property_fields" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum_property_fields_icon" DEFAULT 'check',
  	"unit" varchar,
  	"show_on_card" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "property_fields_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "agents_locales" (
  	"job_title" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "deals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"stage" "enum_deals_stage" DEFAULT 'new' NOT NULL,
  	"value" numeric,
  	"expected_close" timestamp(3) with time zone,
  	"contact_name" varchar NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"property_id" integer,
  	"agent_id" integer,
  	"source" "enum_deals_source" DEFAULT 'manual',
  	"lost_reason" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "deals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"enquiries_id" integer,
  	"viewings_id" integer
  );
  
  CREATE TABLE "activities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_activities_type" DEFAULT 'note' NOT NULL,
  	"deal_id" integer NOT NULL,
  	"summary" varchar NOT NULL,
  	"details" varchar,
  	"due_at" timestamp(3) with time zone,
  	"done" boolean,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "page_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"path" varchar NOT NULL,
  	"property_id" integer,
  	"agent_id" integer,
  	"views" numeric DEFAULT 0,
  	"visitors" numeric DEFAULT 0,
  	"devices" jsonb,
  	"referrers" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_hero_style" DEFAULT 'image',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"video_url" varchar,
  	"show_search" boolean,
  	"button_label" varchar,
  	"button_url" varchar,
  	"secondary_button_label" varchar,
  	"secondary_button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"width" "enum_pages_blocks_text_width" DEFAULT 'narrow',
  	"background" "enum_pages_blocks_text_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_side" "enum_pages_blocks_image_text_image_side" DEFAULT 'left',
  	"button_label" varchar,
  	"button_url" varchar,
  	"background" "enum_pages_blocks_image_text_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_property_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"show" "enum_pages_blocks_property_grid_show" DEFAULT 'featured',
  	"town" varchar,
  	"label_id" integer,
  	"development_id" integer,
  	"limit" numeric DEFAULT 6,
  	"button_label" varchar,
  	"button_url" varchar,
  	"background" "enum_pages_blocks_property_grid_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_search_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum_pages_blocks_search_bar_mode" DEFAULT 'buy',
  	"background" "enum_pages_blocks_search_bar_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_agents_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum_pages_blocks_agents_grid_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum_pages_blocks_stats_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_icon_grid_items_icon" DEFAULT 'check',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_icon_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum_pages_blocks_icon_grid_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum_pages_blocks_testimonials_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum_pages_blocks_faq_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"button_label" varchar,
  	"button_url" varchar,
  	"secondary_button_label" varchar,
  	"secondary_button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"form" "enum_pages_blocks_lead_form_form" DEFAULT 'contact',
  	"button_label" varchar,
  	"background" "enum_pages_blocks_lead_form_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"category_id" integer,
  	"limit" numeric DEFAULT 3,
  	"background" "enum_pages_blocks_latest_posts_background" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_hero_style" DEFAULT 'image',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"video_url" varchar,
  	"show_search" boolean,
  	"button_label" varchar,
  	"button_url" varchar,
  	"secondary_button_label" varchar,
  	"secondary_button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"width" "enum__pages_v_blocks_text_width" DEFAULT 'narrow',
  	"background" "enum__pages_v_blocks_text_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_side" "enum__pages_v_blocks_image_text_image_side" DEFAULT 'left',
  	"button_label" varchar,
  	"button_url" varchar,
  	"background" "enum__pages_v_blocks_image_text_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_property_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"show" "enum__pages_v_blocks_property_grid_show" DEFAULT 'featured',
  	"town" varchar,
  	"label_id" integer,
  	"development_id" integer,
  	"limit" numeric DEFAULT 6,
  	"button_label" varchar,
  	"button_url" varchar,
  	"background" "enum__pages_v_blocks_property_grid_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_search_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"mode" "enum__pages_v_blocks_search_bar_mode" DEFAULT 'buy',
  	"background" "enum__pages_v_blocks_search_bar_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_agents_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum__pages_v_blocks_agents_grid_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum__pages_v_blocks_stats_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_icon_grid_items_icon" DEFAULT 'check',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum__pages_v_blocks_icon_grid_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum__pages_v_blocks_testimonials_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"background" "enum__pages_v_blocks_faq_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"image_id" integer,
  	"button_label" varchar,
  	"button_url" varchar,
  	"secondary_button_label" varchar,
  	"secondary_button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"form" "enum__pages_v_blocks_lead_form_form" DEFAULT 'contact',
  	"button_label" varchar,
  	"background" "enum__pages_v_blocks_lead_form_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_latest_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"category_id" integer,
  	"limit" numeric DEFAULT 3,
  	"background" "enum__pages_v_blocks_latest_posts_background" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"page_id" integer
  );
  
  CREATE TABLE "site_settings_menu_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_settings_menu_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"page_id" integer
  );
  
  CREATE TABLE "site_settings_menu_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_viewing_slots_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_viewing_slots_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_currencies" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_currencies",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_currency_rates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"rate" numeric
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar DEFAULT 'Private residences · Sales & lettings',
  	"cta_label" varchar,
  	"hero_headline" varchar DEFAULT 'Homes of rare character.',
  	"hero_text" varchar DEFAULT 'Search every home we sell and let, book viewings online and talk to an agent who knows the area.',
  	"brochure_footer" varchar DEFAULT 'Particulars are for guidance only and do not form part of any contract.',
  	"mls_disclaimer" varchar DEFAULT 'Listing information is deemed reliable but not guaranteed. Information is provided exclusively for consumers'' personal, non-commercial use.',
  	"meta_description" varchar,
  	"privacy_policy" jsonb,
  	"consent_text" varchar DEFAULT 'I agree to my details being used to answer this request, as set out in the privacy policy.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_pages_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_posts_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_categories_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_pages_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_posts_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_categories_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "pages_hero_hero_media_idx";
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "pages_rels_pages_id_idx";
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "pages_rels_categories_id_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "_pages_v_rels_pages_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_categories_id_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "enquiries" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "properties" ADD COLUMN "year_built" numeric;
  ALTER TABLE "properties" ADD COLUMN "energy_class" "enum_properties_energy_class";
  ALTER TABLE "properties" ADD COLUMN "address_country" varchar;
  ALTER TABLE "properties" ADD COLUMN "nearby" jsonb;
  ALTER TABLE "properties" ADD COLUMN "nearby_at" timestamp(3) with time zone;
  ALTER TABLE "properties" ADD COLUMN "walk_score" jsonb;
  ALTER TABLE "properties" ADD COLUMN "private_notes" varchar;
  ALTER TABLE "properties" ADD COLUMN "listing_key" varchar;
  ALTER TABLE "properties" ADD COLUMN "mls_number" varchar;
  ALTER TABLE "properties" ADD COLUMN "source_updated_at" timestamp(3) with time zone;
  ALTER TABLE "properties" ADD COLUMN "list_office" varchar;
  ALTER TABLE "properties" ADD COLUMN "list_agent_name" varchar;
  ALTER TABLE "properties" ADD COLUMN "reference" varchar;
  ALTER TABLE "properties" ADD COLUMN "parent_id" integer;
  ALTER TABLE "properties" ADD COLUMN "expires_at" timestamp(3) with time zone;
  ALTER TABLE "properties" ADD COLUMN "source" "enum_properties_source" DEFAULT 'manual';
  ALTER TABLE "properties_rels" ADD COLUMN "property_labels_id" integer;
  ALTER TABLE "agents" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "agents" ADD COLUMN "instagram" varchar;
  ALTER TABLE "agents" ADD COLUMN "whatsapp" varchar;
  ALTER TABLE "pages" ADD COLUMN "template" "enum_pages_template";
  ALTER TABLE "pages" ADD COLUMN "chrome" "enum_pages_chrome" DEFAULT 'default';
  ALTER TABLE "pages_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "pages_rels" ADD COLUMN "properties_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_template" "enum__pages_v_version_template";
  ALTER TABLE "_pages_v" ADD COLUMN "version_chrome" "enum__pages_v_version_chrome" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_pages_v_rels" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_pages_v_rels" ADD COLUMN "properties_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "agents_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "posts" ADD COLUMN "template" "enum_posts_template";
  ALTER TABLE "_posts_v" ADD COLUMN "version_template" "enum__posts_v_version_template";
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "categories_breadcrumbs" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "property_labels_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "property_fields_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "deals_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "activities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_stats_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "header_sticky" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "header_transparent" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "home_page_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "ref_prefix" varchar DEFAULT 'REF-';
  ALTER TABLE "site_settings" ADD COLUMN "default_view" "enum_site_settings_default_view" DEFAULT 'map';
  ALTER TABLE "site_settings" ADD COLUMN "favourites" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "compare" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "quick_view" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_start" varchar DEFAULT '09:00';
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_end" varchar DEFAULT '18:00';
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_slot_minutes" numeric DEFAULT 30;
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_notice_hours" numeric DEFAULT 24;
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_days_ahead" numeric DEFAULT 14;
  ALTER TABLE "site_settings" ADD COLUMN "viewing_slots_timezone" varchar DEFAULT 'Europe/London';
  ALTER TABLE "site_settings" ADD COLUMN "language_switcher" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "currency_switcher" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "rates_cache" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "mls_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "mls_provider" "enum_site_settings_mls_provider" DEFAULT 'bridge';
  ALTER TABLE "site_settings" ADD COLUMN "mls_mls_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_api_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_auth" "enum_site_settings_mls_auth" DEFAULT 'token';
  ALTER TABLE "site_settings" ADD COLUMN "mls_access_token" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_token_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_client_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_client_secret" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_scope" varchar DEFAULT 'api';
  ALTER TABLE "site_settings" ADD COLUMN "mls_filter" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "mls_sync_hours" numeric DEFAULT 6;
  ALTER TABLE "site_settings" ADD COLUMN "mls_max_listings" numeric DEFAULT 2000;
  ALTER TABLE "site_settings" ADD COLUMN "mls_include_sold" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "mls_default_agent_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "mls_logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "mls_last_sync" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "features_nearby_places" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_walk_score" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_walk_score_key" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_captcha" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "features_captcha_provider" "enum_site_settings_features_captcha_provider" DEFAULT 'turnstile';
  ALTER TABLE "site_settings" ADD COLUMN "features_captcha_site_key" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "features_captcha_secret" varchar;
  ALTER TABLE "properties_features_locales" ADD CONSTRAINT "properties_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_custom_fields" ADD CONSTRAINT "properties_custom_fields_field_id_property_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."property_fields"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_custom_fields" ADD CONSTRAINT "properties_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_attachments" ADD CONSTRAINT "properties_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_attachments" ADD CONSTRAINT "properties_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_attachments_locales" ADD CONSTRAINT "properties_attachments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_external_photos" ADD CONSTRAINT "properties_external_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_locales" ADD CONSTRAINT "properties_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_labels_locales" ADD CONSTRAINT "property_labels_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."property_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_fields_locales" ADD CONSTRAINT "property_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."property_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents_locales" ADD CONSTRAINT "agents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals" ADD CONSTRAINT "deals_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "deals_rels" ADD CONSTRAINT "deals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deals_rels" ADD CONSTRAINT "deals_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "deals_rels" ADD CONSTRAINT "deals_rels_viewings_fk" FOREIGN KEY ("viewings_id") REFERENCES "public"."viewings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_stats" ADD CONSTRAINT "page_stats_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_stats" ADD CONSTRAINT "page_stats_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_property_grid" ADD CONSTRAINT "pages_blocks_property_grid_label_id_property_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."property_labels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_property_grid" ADD CONSTRAINT "pages_blocks_property_grid_development_id_properties_id_fk" FOREIGN KEY ("development_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_property_grid" ADD CONSTRAINT "pages_blocks_property_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_search_bar" ADD CONSTRAINT "pages_blocks_search_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_agents_grid" ADD CONSTRAINT "pages_blocks_agents_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid_items" ADD CONSTRAINT "pages_blocks_icon_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_icon_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_grid" ADD CONSTRAINT "pages_blocks_icon_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form" ADD CONSTRAINT "pages_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_property_grid" ADD CONSTRAINT "_pages_v_blocks_property_grid_label_id_property_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."property_labels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_property_grid" ADD CONSTRAINT "_pages_v_blocks_property_grid_development_id_properties_id_fk" FOREIGN KEY ("development_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_property_grid" ADD CONSTRAINT "_pages_v_blocks_property_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_search_bar" ADD CONSTRAINT "_pages_v_blocks_search_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_agents_grid" ADD CONSTRAINT "_pages_v_blocks_agents_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_grid_items" ADD CONSTRAINT "_pages_v_blocks_icon_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_icon_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_grid" ADD CONSTRAINT "_pages_v_blocks_icon_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form" ADD CONSTRAINT "_pages_v_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns_links" ADD CONSTRAINT "site_settings_menu_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns_links" ADD CONSTRAINT "site_settings_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns_links_locales" ADD CONSTRAINT "site_settings_menu_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns" ADD CONSTRAINT "site_settings_menu_columns_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns" ADD CONSTRAINT "site_settings_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_columns_locales" ADD CONSTRAINT "site_settings_menu_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu" ADD CONSTRAINT "site_settings_menu_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_menu" ADD CONSTRAINT "site_settings_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_menu_locales" ADD CONSTRAINT "site_settings_menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_viewing_slots_days" ADD CONSTRAINT "site_settings_viewing_slots_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_languages" ADD CONSTRAINT "site_settings_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_currencies" ADD CONSTRAINT "site_settings_currencies_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_currency_rates" ADD CONSTRAINT "site_settings_currency_rates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "properties_features_locales_locale_parent_id_unique" ON "properties_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_features_locales_parent_id_idx" ON "properties_features_locales" USING btree ("_parent_id");
  CREATE INDEX "properties_custom_fields_order_idx" ON "properties_custom_fields" USING btree ("_order");
  CREATE INDEX "properties_custom_fields_parent_id_idx" ON "properties_custom_fields" USING btree ("_parent_id");
  CREATE INDEX "properties_custom_fields_field_idx" ON "properties_custom_fields" USING btree ("field_id");
  CREATE INDEX "properties_attachments_order_idx" ON "properties_attachments" USING btree ("_order");
  CREATE INDEX "properties_attachments_parent_id_idx" ON "properties_attachments" USING btree ("_parent_id");
  CREATE INDEX "properties_attachments_file_idx" ON "properties_attachments" USING btree ("file_id");
  CREATE UNIQUE INDEX "properties_attachments_locales_locale_parent_id_unique" ON "properties_attachments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_attachments_locales_parent_id_idx" ON "properties_attachments_locales" USING btree ("_parent_id");
  CREATE INDEX "properties_external_photos_order_idx" ON "properties_external_photos" USING btree ("_order");
  CREATE INDEX "properties_external_photos_parent_id_idx" ON "properties_external_photos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "properties_locales_locale_parent_id_unique" ON "properties_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_locales_parent_id_idx" ON "properties_locales" USING btree ("_parent_id");
  CREATE INDEX "property_labels_updated_at_idx" ON "property_labels" USING btree ("updated_at");
  CREATE INDEX "property_labels_created_at_idx" ON "property_labels" USING btree ("created_at");
  CREATE UNIQUE INDEX "property_labels_locales_locale_parent_id_unique" ON "property_labels_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "property_labels_locales_parent_id_idx" ON "property_labels_locales" USING btree ("_parent_id");
  CREATE INDEX "property_fields_updated_at_idx" ON "property_fields" USING btree ("updated_at");
  CREATE INDEX "property_fields_created_at_idx" ON "property_fields" USING btree ("created_at");
  CREATE UNIQUE INDEX "property_fields_locales_locale_parent_id_unique" ON "property_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "property_fields_locales_parent_id_idx" ON "property_fields_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "agents_locales_locale_parent_id_unique" ON "agents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "agents_locales_parent_id_idx" ON "agents_locales" USING btree ("_parent_id");
  CREATE INDEX "deals_stage_idx" ON "deals" USING btree ("stage");
  CREATE INDEX "deals_property_idx" ON "deals" USING btree ("property_id");
  CREATE INDEX "deals_agent_idx" ON "deals" USING btree ("agent_id");
  CREATE INDEX "deals_updated_at_idx" ON "deals" USING btree ("updated_at");
  CREATE INDEX "deals_created_at_idx" ON "deals" USING btree ("created_at");
  CREATE INDEX "deals_rels_order_idx" ON "deals_rels" USING btree ("order");
  CREATE INDEX "deals_rels_parent_idx" ON "deals_rels" USING btree ("parent_id");
  CREATE INDEX "deals_rels_path_idx" ON "deals_rels" USING btree ("path");
  CREATE INDEX "deals_rels_enquiries_id_idx" ON "deals_rels" USING btree ("enquiries_id");
  CREATE INDEX "deals_rels_viewings_id_idx" ON "deals_rels" USING btree ("viewings_id");
  CREATE INDEX "activities_deal_idx" ON "activities" USING btree ("deal_id");
  CREATE INDEX "activities_created_by_idx" ON "activities" USING btree ("created_by_id");
  CREATE INDEX "activities_updated_at_idx" ON "activities" USING btree ("updated_at");
  CREATE INDEX "activities_created_at_idx" ON "activities" USING btree ("created_at");
  CREATE INDEX "page_stats_day_idx" ON "page_stats" USING btree ("day");
  CREATE INDEX "page_stats_path_idx" ON "page_stats" USING btree ("path");
  CREATE INDEX "page_stats_property_idx" ON "page_stats" USING btree ("property_id");
  CREATE INDEX "page_stats_agent_idx" ON "page_stats" USING btree ("agent_id");
  CREATE INDEX "page_stats_updated_at_idx" ON "page_stats" USING btree ("updated_at");
  CREATE INDEX "page_stats_created_at_idx" ON "page_stats" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_text_locale_idx" ON "pages_blocks_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_locale_idx" ON "pages_blocks_image_text" USING btree ("_locale");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_property_grid_order_idx" ON "pages_blocks_property_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_property_grid_parent_id_idx" ON "pages_blocks_property_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_property_grid_path_idx" ON "pages_blocks_property_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_property_grid_locale_idx" ON "pages_blocks_property_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_property_grid_label_idx" ON "pages_blocks_property_grid" USING btree ("label_id");
  CREATE INDEX "pages_blocks_property_grid_development_idx" ON "pages_blocks_property_grid" USING btree ("development_id");
  CREATE INDEX "pages_blocks_search_bar_order_idx" ON "pages_blocks_search_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_search_bar_parent_id_idx" ON "pages_blocks_search_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_search_bar_path_idx" ON "pages_blocks_search_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_search_bar_locale_idx" ON "pages_blocks_search_bar" USING btree ("_locale");
  CREATE INDEX "pages_blocks_agents_grid_order_idx" ON "pages_blocks_agents_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_agents_grid_parent_id_idx" ON "pages_blocks_agents_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_agents_grid_path_idx" ON "pages_blocks_agents_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_agents_grid_locale_idx" ON "pages_blocks_agents_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locale_idx" ON "pages_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_locale_idx" ON "pages_blocks_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_icon_grid_items_order_idx" ON "pages_blocks_icon_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_grid_items_parent_id_idx" ON "pages_blocks_icon_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_grid_items_locale_idx" ON "pages_blocks_icon_grid_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_icon_grid_order_idx" ON "pages_blocks_icon_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_grid_parent_id_idx" ON "pages_blocks_icon_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_grid_path_idx" ON "pages_blocks_icon_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_icon_grid_locale_idx" ON "pages_blocks_icon_grid" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_locale_idx" ON "pages_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_locale_idx" ON "pages_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_locale_idx" ON "pages_blocks_cta_banner" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_banner_image_idx" ON "pages_blocks_cta_banner" USING btree ("image_id");
  CREATE INDEX "pages_blocks_lead_form_order_idx" ON "pages_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_lead_form_parent_id_idx" ON "pages_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_path_idx" ON "pages_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_lead_form_locale_idx" ON "pages_blocks_lead_form" USING btree ("_locale");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_locale_idx" ON "pages_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_locale_idx" ON "pages_blocks_video" USING btree ("_locale");
  CREATE INDEX "pages_blocks_latest_posts_order_idx" ON "pages_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_posts_parent_id_idx" ON "pages_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_path_idx" ON "pages_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "pages_blocks_latest_posts_locale_idx" ON "pages_blocks_latest_posts" USING btree ("_locale");
  CREATE INDEX "pages_blocks_latest_posts_category_idx" ON "pages_blocks_latest_posts" USING btree ("category_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_locale_idx" ON "_pages_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_text_locale_idx" ON "_pages_v_blocks_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_locale_idx" ON "_pages_v_blocks_image_text" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_property_grid_order_idx" ON "_pages_v_blocks_property_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_property_grid_parent_id_idx" ON "_pages_v_blocks_property_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_property_grid_path_idx" ON "_pages_v_blocks_property_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_property_grid_locale_idx" ON "_pages_v_blocks_property_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_property_grid_label_idx" ON "_pages_v_blocks_property_grid" USING btree ("label_id");
  CREATE INDEX "_pages_v_blocks_property_grid_development_idx" ON "_pages_v_blocks_property_grid" USING btree ("development_id");
  CREATE INDEX "_pages_v_blocks_search_bar_order_idx" ON "_pages_v_blocks_search_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_search_bar_parent_id_idx" ON "_pages_v_blocks_search_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_search_bar_path_idx" ON "_pages_v_blocks_search_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_search_bar_locale_idx" ON "_pages_v_blocks_search_bar" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_agents_grid_order_idx" ON "_pages_v_blocks_agents_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_agents_grid_parent_id_idx" ON "_pages_v_blocks_agents_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_agents_grid_path_idx" ON "_pages_v_blocks_agents_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_agents_grid_locale_idx" ON "_pages_v_blocks_agents_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_locale_idx" ON "_pages_v_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_locale_idx" ON "_pages_v_blocks_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_icon_grid_items_order_idx" ON "_pages_v_blocks_icon_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_grid_items_parent_id_idx" ON "_pages_v_blocks_icon_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_grid_items_locale_idx" ON "_pages_v_blocks_icon_grid_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_icon_grid_order_idx" ON "_pages_v_blocks_icon_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_grid_parent_id_idx" ON "_pages_v_blocks_icon_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_grid_path_idx" ON "_pages_v_blocks_icon_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_icon_grid_locale_idx" ON "_pages_v_blocks_icon_grid" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_locale_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_locale_idx" ON "_pages_v_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_locale_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_banner_image_idx" ON "_pages_v_blocks_cta_banner" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_lead_form_order_idx" ON "_pages_v_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lead_form_parent_id_idx" ON "_pages_v_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_path_idx" ON "_pages_v_blocks_lead_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lead_form_locale_idx" ON "_pages_v_blocks_lead_form" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_locale_idx" ON "_pages_v_blocks_gallery" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_locale_idx" ON "_pages_v_blocks_video" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_latest_posts_order_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_latest_posts_parent_id_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_path_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_latest_posts_locale_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_latest_posts_category_idx" ON "_pages_v_blocks_latest_posts" USING btree ("category_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_locales_parent_id_idx" ON "forms_blocks_checkbox_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_locales_parent_id_idx" ON "forms_blocks_country_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_locales_parent_id_idx" ON "forms_blocks_email_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_locales_parent_id_idx" ON "forms_blocks_message_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_locales_parent_id_idx" ON "forms_blocks_number_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_locales_parent_id_idx" ON "forms_blocks_select_options_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_locales_parent_id_idx" ON "forms_blocks_select_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_locales_parent_id_idx" ON "forms_blocks_state_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_locales_parent_id_idx" ON "forms_blocks_text_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_locales_parent_id_idx" ON "forms_blocks_textarea_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_locales_parent_id_idx" ON "forms_emails_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_locales_parent_id_idx" ON "forms_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_locales_parent_id_idx" ON "search_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_columns_links_order_idx" ON "site_settings_menu_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_menu_columns_links_parent_id_idx" ON "site_settings_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_columns_links_page_idx" ON "site_settings_menu_columns_links" USING btree ("page_id");
  CREATE UNIQUE INDEX "site_settings_menu_columns_links_locales_locale_parent_id_un" ON "site_settings_menu_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_menu_columns_links_locales_parent_id_idx" ON "site_settings_menu_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_columns_order_idx" ON "site_settings_menu_columns" USING btree ("_order");
  CREATE INDEX "site_settings_menu_columns_parent_id_idx" ON "site_settings_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_columns_image_idx" ON "site_settings_menu_columns" USING btree ("image_id");
  CREATE UNIQUE INDEX "site_settings_menu_columns_locales_locale_parent_id_unique" ON "site_settings_menu_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_menu_columns_locales_parent_id_idx" ON "site_settings_menu_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_order_idx" ON "site_settings_menu" USING btree ("_order");
  CREATE INDEX "site_settings_menu_parent_id_idx" ON "site_settings_menu" USING btree ("_parent_id");
  CREATE INDEX "site_settings_menu_page_idx" ON "site_settings_menu" USING btree ("page_id");
  CREATE UNIQUE INDEX "site_settings_menu_locales_locale_parent_id_unique" ON "site_settings_menu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_menu_locales_parent_id_idx" ON "site_settings_menu_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_viewing_slots_days_order_idx" ON "site_settings_viewing_slots_days" USING btree ("order");
  CREATE INDEX "site_settings_viewing_slots_days_parent_idx" ON "site_settings_viewing_slots_days" USING btree ("parent_id");
  CREATE INDEX "site_settings_languages_order_idx" ON "site_settings_languages" USING btree ("order");
  CREATE INDEX "site_settings_languages_parent_idx" ON "site_settings_languages" USING btree ("parent_id");
  CREATE INDEX "site_settings_currencies_order_idx" ON "site_settings_currencies" USING btree ("order");
  CREATE INDEX "site_settings_currencies_parent_idx" ON "site_settings_currencies" USING btree ("parent_id");
  CREATE INDEX "site_settings_currency_rates_order_idx" ON "site_settings_currency_rates" USING btree ("_order");
  CREATE INDEX "site_settings_currency_rates_parent_id_idx" ON "site_settings_currency_rates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  ALTER TABLE "properties" ADD CONSTRAINT "properties_parent_id_properties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_property_labels_fk" FOREIGN KEY ("property_labels_id") REFERENCES "public"."property_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_property_labels_fk" FOREIGN KEY ("property_labels_id") REFERENCES "public"."property_labels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_property_fields_fk" FOREIGN KEY ("property_fields_id") REFERENCES "public"."property_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_deals_fk" FOREIGN KEY ("deals_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_activities_fk" FOREIGN KEY ("activities_id") REFERENCES "public"."activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_stats_fk" FOREIGN KEY ("page_stats_id") REFERENCES "public"."page_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_home_page_id_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_mls_default_agent_id_agents_id_fk" FOREIGN KEY ("mls_default_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_mls_logo_id_media_id_fk" FOREIGN KEY ("mls_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "properties_lat_idx" ON "properties" USING btree ("lat");
  CREATE INDEX "properties_lng_idx" ON "properties" USING btree ("lng");
  CREATE INDEX "properties_listing_key_idx" ON "properties" USING btree ("listing_key");
  CREATE INDEX "properties_reference_idx" ON "properties" USING btree ("reference");
  CREATE INDEX "properties_parent_idx" ON "properties" USING btree ("parent_id");
  CREATE INDEX "properties_expires_at_idx" ON "properties" USING btree ("expires_at");
  CREATE INDEX "properties_source_idx" ON "properties" USING btree ("source");
  CREATE INDEX "properties_rels_property_labels_id_idx" ON "properties_rels" USING btree ("property_labels_id");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_properties_id_idx" ON "pages_rels" USING btree ("properties_id","locale");
  CREATE INDEX "pages_rels_agents_id_idx" ON "pages_rels" USING btree ("agents_id","locale");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id","locale");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_rels_properties_id_idx" ON "_pages_v_rels" USING btree ("properties_id","locale");
  CREATE INDEX "_pages_v_rels_agents_id_idx" ON "_pages_v_rels" USING btree ("agents_id","locale");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "payload_locked_documents_rels_property_labels_id_idx" ON "payload_locked_documents_rels" USING btree ("property_labels_id");
  CREATE INDEX "payload_locked_documents_rels_property_fields_id_idx" ON "payload_locked_documents_rels" USING btree ("property_fields_id");
  CREATE INDEX "payload_locked_documents_rels_deals_id_idx" ON "payload_locked_documents_rels" USING btree ("deals_id");
  CREATE INDEX "payload_locked_documents_rels_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("activities_id");
  CREATE INDEX "payload_locked_documents_rels_page_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("page_stats_id");
  CREATE INDEX "site_settings_home_page_idx" ON "site_settings" USING btree ("home_page_id");
  CREATE INDEX "site_settings_mls_mls_default_agent_idx" ON "site_settings" USING btree ("mls_default_agent_id");
  CREATE INDEX "site_settings_mls_mls_logo_idx" ON "site_settings" USING btree ("mls_logo_id");
  -- Keep existing content: move text into the main language before the old columns are dropped.
  INSERT INTO "properties_locales" ("title", "summary", "description", "_locale", "_parent_id") SELECT "title", "summary", "description", '${sql.raw(L)}', "id" FROM "properties";
  INSERT INTO "properties_features_locales" ("feature", "_locale", "_parent_id") SELECT "feature", '${sql.raw(L)}', "id" FROM "properties_features";
  INSERT INTO "agents_locales" ("job_title", "bio", "_locale", "_parent_id") SELECT "job_title", "bio", '${sql.raw(L)}', "id" FROM "agents";
  INSERT INTO "categories_locales" ("title", "_locale", "_parent_id") SELECT "title", '${sql.raw(L)}', "id" FROM "categories";
  INSERT INTO "site_settings_locales" ("tagline", "hero_headline", "hero_text", "brochure_footer", "meta_description", "privacy_policy", "consent_text", "_locale", "_parent_id") SELECT "tagline", "hero_headline", "hero_text", "brochure_footer", "meta_description", "privacy_policy", "consent_text", '${sql.raw(L)}', "id" FROM "site_settings";
  UPDATE "properties" SET "reference" = 'REF-' || (1000 + "id") WHERE "reference" IS NULL;
  ALTER TABLE "properties_features" DROP COLUMN "feature";
  ALTER TABLE "properties" DROP COLUMN "title";
  ALTER TABLE "properties" DROP COLUMN "summary";
  ALTER TABLE "properties" DROP COLUMN "description";
  ALTER TABLE "agents" DROP COLUMN "job_title";
  ALTER TABLE "agents" DROP COLUMN "bio";
  ALTER TABLE "pages" DROP COLUMN "title";
  ALTER TABLE "pages" DROP COLUMN "hero_type";
  ALTER TABLE "pages" DROP COLUMN "hero_rich_text";
  ALTER TABLE "pages" DROP COLUMN "hero_media_id";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "pages_rels" DROP COLUMN "pages_id";
  ALTER TABLE "pages_rels" DROP COLUMN "posts_id";
  ALTER TABLE "pages_rels" DROP COLUMN "categories_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_type";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "categories_id";
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "content";
  ALTER TABLE "posts" DROP COLUMN "meta_title";
  ALTER TABLE "posts" DROP COLUMN "meta_image_id";
  ALTER TABLE "posts" DROP COLUMN "meta_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "categories" DROP COLUMN "title";
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_country" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_message" DROP COLUMN "message";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_state" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value";
  ALTER TABLE "forms_emails" DROP COLUMN "subject";
  ALTER TABLE "forms_emails" DROP COLUMN "message";
  ALTER TABLE "forms" DROP COLUMN "submit_button_label";
  ALTER TABLE "forms" DROP COLUMN "confirmation_message";
  ALTER TABLE "search" DROP COLUMN "title";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "hero_headline";
  ALTER TABLE "site_settings" DROP COLUMN "hero_text";
  ALTER TABLE "site_settings" DROP COLUMN "brochure_footer";
  ALTER TABLE "site_settings" DROP COLUMN "meta_description";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_policy";
  ALTER TABLE "site_settings" DROP COLUMN "consent_text";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_version_hero_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "properties_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_custom_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_attachments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_attachments_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_external_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "property_labels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "property_labels_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "property_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "property_fields_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "deals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "deals_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "activities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "page_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_property_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_search_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_agents_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_icon_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_lead_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_latest_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_property_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_search_bar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_agents_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_icon_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_lead_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_latest_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_menu_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_viewing_slots_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_currencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_currency_rates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "properties_features_locales" CASCADE;
  DROP TABLE "properties_custom_fields" CASCADE;
  DROP TABLE "properties_attachments" CASCADE;
  DROP TABLE "properties_attachments_locales" CASCADE;
  DROP TABLE "properties_external_photos" CASCADE;
  DROP TABLE "properties_locales" CASCADE;
  DROP TABLE "property_labels" CASCADE;
  DROP TABLE "property_labels_locales" CASCADE;
  DROP TABLE "property_fields" CASCADE;
  DROP TABLE "property_fields_locales" CASCADE;
  DROP TABLE "agents_locales" CASCADE;
  DROP TABLE "deals" CASCADE;
  DROP TABLE "deals_rels" CASCADE;
  DROP TABLE "activities" CASCADE;
  DROP TABLE "page_stats" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_property_grid" CASCADE;
  DROP TABLE "pages_blocks_search_bar" CASCADE;
  DROP TABLE "pages_blocks_agents_grid" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_icon_grid_items" CASCADE;
  DROP TABLE "pages_blocks_icon_grid" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_lead_form" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_latest_posts" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_property_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_search_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_agents_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_posts" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "site_settings_menu_columns_links" CASCADE;
  DROP TABLE "site_settings_menu_columns_links_locales" CASCADE;
  DROP TABLE "site_settings_menu_columns" CASCADE;
  DROP TABLE "site_settings_menu_columns_locales" CASCADE;
  DROP TABLE "site_settings_menu" CASCADE;
  DROP TABLE "site_settings_menu_locales" CASCADE;
  DROP TABLE "site_settings_viewing_slots_days" CASCADE;
  DROP TABLE "site_settings_languages" CASCADE;
  DROP TABLE "site_settings_currencies" CASCADE;
  DROP TABLE "site_settings_currency_rates" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "properties" DROP CONSTRAINT "properties_parent_id_properties_id_fk";
  
  ALTER TABLE "properties_rels" DROP CONSTRAINT "properties_rels_property_labels_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_properties_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_agents_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_media_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_properties_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_agents_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_property_labels_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_property_fields_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_deals_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_activities_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_stats_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_home_page_id_pages_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_mls_default_agent_id_agents_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_mls_logo_id_media_id_fk";
  
  ALTER TABLE "properties" ALTER COLUMN "property_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_properties_property_type";
  CREATE TYPE "public"."enum_properties_property_type" AS ENUM('house', 'apartment', 'townhouse', 'bungalow', 'site', 'commercial');
  ALTER TABLE "properties" ALTER COLUMN "property_type" SET DATA TYPE "public"."enum_properties_property_type" USING "property_type"::"public"."enum_properties_property_type";
  ALTER TABLE "enquiries" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "enquiries" ALTER COLUMN "type" SET DEFAULT 'property'::text;
  DROP TYPE "public"."enum_enquiries_type";
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('property', 'valuation', 'contact');
  ALTER TABLE "enquiries" ALTER COLUMN "type" SET DEFAULT 'property'::"public"."enum_enquiries_type";
  ALTER TABLE "enquiries" ALTER COLUMN "type" SET DATA TYPE "public"."enum_enquiries_type" USING "type"::"public"."enum_enquiries_type";
  DROP INDEX "properties_lat_idx";
  DROP INDEX "properties_lng_idx";
  DROP INDEX "properties_listing_key_idx";
  DROP INDEX "properties_reference_idx";
  DROP INDEX "properties_parent_idx";
  DROP INDEX "properties_expires_at_idx";
  DROP INDEX "properties_source_idx";
  DROP INDEX "properties_rels_property_labels_id_idx";
  DROP INDEX "pages_rels_locale_idx";
  DROP INDEX "pages_rels_properties_id_idx";
  DROP INDEX "pages_rels_agents_id_idx";
  DROP INDEX "pages_rels_media_id_idx";
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "_pages_v_rels_locale_idx";
  DROP INDEX "_pages_v_rels_properties_id_idx";
  DROP INDEX "_pages_v_rels_agents_id_idx";
  DROP INDEX "_pages_v_rels_media_id_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "categories_breadcrumbs_locale_idx";
  DROP INDEX "payload_locked_documents_rels_property_labels_id_idx";
  DROP INDEX "payload_locked_documents_rels_property_fields_id_idx";
  DROP INDEX "payload_locked_documents_rels_deals_id_idx";
  DROP INDEX "payload_locked_documents_rels_activities_id_idx";
  DROP INDEX "payload_locked_documents_rels_page_stats_id_idx";
  DROP INDEX "site_settings_home_page_idx";
  DROP INDEX "site_settings_mls_mls_default_agent_idx";
  DROP INDEX "site_settings_mls_mls_logo_idx";
  ALTER TABLE "enquiries" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "properties_features" ADD COLUMN "feature" varchar NOT NULL;
  ALTER TABLE "properties" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "properties" ADD COLUMN "summary" varchar;
  ALTER TABLE "properties" ADD COLUMN "description" jsonb;
  ALTER TABLE "agents" ADD COLUMN "job_title" varchar;
  ALTER TABLE "agents" ADD COLUMN "bio" varchar;
  ALTER TABLE "pages" ADD COLUMN "title" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "pages" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "categories" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_message" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_emails" ADD COLUMN "subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL;
  ALTER TABLE "forms_emails" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms" ADD COLUMN "submit_button_label" varchar;
  ALTER TABLE "forms" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "search" ADD COLUMN "title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar DEFAULT 'Private residences · Sales & lettings';
  ALTER TABLE "site_settings" ADD COLUMN "hero_headline" varchar DEFAULT 'Homes of rare character.';
  ALTER TABLE "site_settings" ADD COLUMN "hero_text" varchar DEFAULT 'Search every home we sell and let, book viewings online and talk to an agent who knows the area.';
  ALTER TABLE "site_settings" ADD COLUMN "brochure_footer" varchar DEFAULT 'Particulars are for guidance only and do not form part of any contract.';
  ALTER TABLE "site_settings" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_policy" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "consent_text" varchar DEFAULT 'I agree to my details being used to answer this request, as set out in the privacy policy.';
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  ALTER TABLE "properties" DROP COLUMN "year_built";
  ALTER TABLE "properties" DROP COLUMN "energy_class";
  ALTER TABLE "properties" DROP COLUMN "address_country";
  ALTER TABLE "properties" DROP COLUMN "nearby";
  ALTER TABLE "properties" DROP COLUMN "nearby_at";
  ALTER TABLE "properties" DROP COLUMN "walk_score";
  ALTER TABLE "properties" DROP COLUMN "private_notes";
  ALTER TABLE "properties" DROP COLUMN "listing_key";
  ALTER TABLE "properties" DROP COLUMN "mls_number";
  ALTER TABLE "properties" DROP COLUMN "source_updated_at";
  ALTER TABLE "properties" DROP COLUMN "list_office";
  ALTER TABLE "properties" DROP COLUMN "list_agent_name";
  ALTER TABLE "properties" DROP COLUMN "reference";
  ALTER TABLE "properties" DROP COLUMN "parent_id";
  ALTER TABLE "properties" DROP COLUMN "expires_at";
  ALTER TABLE "properties" DROP COLUMN "source";
  ALTER TABLE "properties_rels" DROP COLUMN "property_labels_id";
  ALTER TABLE "agents" DROP COLUMN "linkedin";
  ALTER TABLE "agents" DROP COLUMN "instagram";
  ALTER TABLE "agents" DROP COLUMN "whatsapp";
  ALTER TABLE "pages" DROP COLUMN "template";
  ALTER TABLE "pages" DROP COLUMN "chrome";
  ALTER TABLE "pages_rels" DROP COLUMN "locale";
  ALTER TABLE "pages_rels" DROP COLUMN "properties_id";
  ALTER TABLE "pages_rels" DROP COLUMN "agents_id";
  ALTER TABLE "pages_rels" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_template";
  ALTER TABLE "_pages_v" DROP COLUMN "version_chrome";
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "locale";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "properties_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "agents_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "media_id";
  ALTER TABLE "posts" DROP COLUMN "template";
  ALTER TABLE "_posts_v" DROP COLUMN "version_template";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "categories_breadcrumbs" DROP COLUMN "_locale";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "property_labels_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "property_fields_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "deals_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "activities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_stats_id";
  ALTER TABLE "site_settings" DROP COLUMN "cta_url";
  ALTER TABLE "site_settings" DROP COLUMN "header_sticky";
  ALTER TABLE "site_settings" DROP COLUMN "header_transparent";
  ALTER TABLE "site_settings" DROP COLUMN "home_page_id";
  ALTER TABLE "site_settings" DROP COLUMN "ref_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "default_view";
  ALTER TABLE "site_settings" DROP COLUMN "favourites";
  ALTER TABLE "site_settings" DROP COLUMN "compare";
  ALTER TABLE "site_settings" DROP COLUMN "quick_view";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_start";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_end";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_slot_minutes";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_notice_hours";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_days_ahead";
  ALTER TABLE "site_settings" DROP COLUMN "viewing_slots_timezone";
  ALTER TABLE "site_settings" DROP COLUMN "language_switcher";
  ALTER TABLE "site_settings" DROP COLUMN "currency_switcher";
  ALTER TABLE "site_settings" DROP COLUMN "rates_cache";
  ALTER TABLE "site_settings" DROP COLUMN "mls_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "mls_provider";
  ALTER TABLE "site_settings" DROP COLUMN "mls_mls_name";
  ALTER TABLE "site_settings" DROP COLUMN "mls_api_url";
  ALTER TABLE "site_settings" DROP COLUMN "mls_auth";
  ALTER TABLE "site_settings" DROP COLUMN "mls_access_token";
  ALTER TABLE "site_settings" DROP COLUMN "mls_token_url";
  ALTER TABLE "site_settings" DROP COLUMN "mls_client_id";
  ALTER TABLE "site_settings" DROP COLUMN "mls_client_secret";
  ALTER TABLE "site_settings" DROP COLUMN "mls_scope";
  ALTER TABLE "site_settings" DROP COLUMN "mls_filter";
  ALTER TABLE "site_settings" DROP COLUMN "mls_sync_hours";
  ALTER TABLE "site_settings" DROP COLUMN "mls_max_listings";
  ALTER TABLE "site_settings" DROP COLUMN "mls_include_sold";
  ALTER TABLE "site_settings" DROP COLUMN "mls_default_agent_id";
  ALTER TABLE "site_settings" DROP COLUMN "mls_logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "mls_last_sync";
  ALTER TABLE "site_settings" DROP COLUMN "features_nearby_places";
  ALTER TABLE "site_settings" DROP COLUMN "features_walk_score";
  ALTER TABLE "site_settings" DROP COLUMN "features_walk_score_key";
  ALTER TABLE "site_settings" DROP COLUMN "features_captcha";
  ALTER TABLE "site_settings" DROP COLUMN "features_captcha_provider";
  ALTER TABLE "site_settings" DROP COLUMN "features_captcha_site_key";
  ALTER TABLE "site_settings" DROP COLUMN "features_captcha_secret";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_properties_energy_class";
  DROP TYPE "public"."enum_properties_source";
  DROP TYPE "public"."enum_property_labels_icon";
  DROP TYPE "public"."enum_property_fields_icon";
  DROP TYPE "public"."enum_deals_stage";
  DROP TYPE "public"."enum_deals_source";
  DROP TYPE "public"."enum_activities_type";
  DROP TYPE "public"."enum_pages_blocks_hero_style";
  DROP TYPE "public"."enum_pages_blocks_text_width";
  DROP TYPE "public"."enum_pages_blocks_text_background";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_side";
  DROP TYPE "public"."enum_pages_blocks_image_text_background";
  DROP TYPE "public"."enum_pages_blocks_property_grid_show";
  DROP TYPE "public"."enum_pages_blocks_property_grid_background";
  DROP TYPE "public"."enum_pages_blocks_search_bar_mode";
  DROP TYPE "public"."enum_pages_blocks_search_bar_background";
  DROP TYPE "public"."enum_pages_blocks_agents_grid_background";
  DROP TYPE "public"."enum_pages_blocks_stats_background";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_items_icon";
  DROP TYPE "public"."enum_pages_blocks_icon_grid_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_background";
  DROP TYPE "public"."enum_pages_blocks_faq_background";
  DROP TYPE "public"."enum_pages_blocks_lead_form_form";
  DROP TYPE "public"."enum_pages_blocks_lead_form_background";
  DROP TYPE "public"."enum_pages_blocks_latest_posts_background";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_chrome";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style";
  DROP TYPE "public"."enum__pages_v_blocks_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_text_background";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_image_text_background";
  DROP TYPE "public"."enum__pages_v_blocks_property_grid_show";
  DROP TYPE "public"."enum__pages_v_blocks_property_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_search_bar_mode";
  DROP TYPE "public"."enum__pages_v_blocks_search_bar_background";
  DROP TYPE "public"."enum__pages_v_blocks_agents_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_background";
  DROP TYPE "public"."enum__pages_v_blocks_icon_grid_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_icon_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_background";
  DROP TYPE "public"."enum__pages_v_blocks_faq_background";
  DROP TYPE "public"."enum__pages_v_blocks_lead_form_form";
  DROP TYPE "public"."enum__pages_v_blocks_lead_form_background";
  DROP TYPE "public"."enum__pages_v_blocks_latest_posts_background";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_chrome";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_template";
  DROP TYPE "public"."enum__posts_v_version_template";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_site_settings_viewing_slots_days";
  DROP TYPE "public"."enum_site_settings_languages";
  DROP TYPE "public"."enum_site_settings_currencies";
  DROP TYPE "public"."enum_site_settings_default_view";
  DROP TYPE "public"."enum_site_settings_mls_provider";
  DROP TYPE "public"."enum_site_settings_mls_auth";
  DROP TYPE "public"."enum_site_settings_features_captcha_provider";`)
}
