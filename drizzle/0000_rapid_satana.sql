CREATE TABLE "artist_comments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"artist_id" bigint NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"rating" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"birthday" date,
	"birthplace" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"group_name" varchar(255),
	"mbti" varchar(255),
	"member_color" varchar(255),
	"name" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"x_account" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "artist_comments" ADD CONSTRAINT "artist_comments_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "index_artist_comments_on_artist_id" ON "artist_comments" USING btree ("artist_id");