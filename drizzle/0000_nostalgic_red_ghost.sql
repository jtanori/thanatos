CREATE TABLE "app_settings" (
	"key" varchar(128) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" varchar(128) NOT NULL,
	"entity" varchar(64) NOT NULL,
	"entity_id" varchar(128),
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interpretations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(64) NOT NULL,
	"key" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content_short" text NOT NULL,
	"content_full" text NOT NULL,
	"content_premium" text,
	"locale" varchar(16) DEFAULT 'es' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"currency" varchar(16) DEFAULT 'MXN' NOT NULL,
	"price_cents_usd" integer DEFAULT 0 NOT NULL,
	"stripe_price_id_mxn" varchar(128),
	"stripe_price_id_usd" varchar(128),
	"interval" varchar(32) DEFAULT 'once' NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"max_charts" integer DEFAULT 1 NOT NULL,
	"pdf_allowed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "plans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(128) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "solar_charts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"guest_name" varchar(255),
	"target_year" integer NOT NULL,
	"birth_date" varchar(32) NOT NULL,
	"birth_time" varchar(32) NOT NULL,
	"birth_place" varchar(255) NOT NULL,
	"birth_lat" double precision NOT NULL,
	"birth_lon" double precision NOT NULL,
	"birth_timezone" varchar(64) DEFAULT 'America/Mexico_City' NOT NULL,
	"return_place" varchar(255) NOT NULL,
	"return_lat" double precision NOT NULL,
	"return_lon" double precision NOT NULL,
	"house_system" varchar(16) DEFAULT 'equal' NOT NULL,
	"natal_sun_longitude" double precision NOT NULL,
	"return_moment_utc" timestamp NOT NULL,
	"asc_longitude" double precision NOT NULL,
	"asc_sign" varchar(32) NOT NULL,
	"mc_longitude" double precision NOT NULL,
	"sun_house" integer NOT NULL,
	"moon_sign" varchar(32) NOT NULL,
	"moon_house" integer NOT NULL,
	"stelliums" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"planets_natal" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"planets_return" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"houses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"aspects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_slug" varchar(64) NOT NULL,
	"status" varchar(32) DEFAULT 'active' NOT NULL,
	"currency" varchar(8) DEFAULT 'MXN' NOT NULL,
	"stripe_session_id" varchar(128),
	"stripe_subscription_id" varchar(128),
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(32) DEFAULT 'user' NOT NULL,
	"plan" varchar(32) DEFAULT 'free' NOT NULL,
	"locale" varchar(16) DEFAULT 'es' NOT NULL,
	"currency" varchar(8) DEFAULT 'MXN' NOT NULL,
	"stripe_customer_id" varchar(128),
	"stripe_subscription_id" varchar(128),
	"birth_date" varchar(32),
	"birth_time" varchar(32),
	"birth_place" varchar(255),
	"birth_lat" double precision,
	"birth_lon" double precision,
	"birth_timezone" varchar(64),
	"return_place" varchar(255),
	"return_lat" double precision,
	"return_lon" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interpretations" ADD CONSTRAINT "interpretations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solar_charts" ADD CONSTRAINT "solar_charts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;