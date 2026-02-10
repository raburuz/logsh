CREATE TABLE "push_subscriptions	" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"keys" jsonb DEFAULT '{"auth":"","p256dh":""}'::jsonb NOT NULL,
	"device_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "push_subscriptions	" ADD CONSTRAINT "push_subscriptions	_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;