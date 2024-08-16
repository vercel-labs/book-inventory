CREATE TABLE IF NOT EXISTS "authors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"average_rating" numeric(3, 2),
	"text_reviews_count" integer,
	"ratings_count" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book_to_author" (
	"book_id" integer NOT NULL,
	"author_id" text NOT NULL,
	CONSTRAINT "book_to_author_book_id_author_id_pk" PRIMARY KEY("book_id","author_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"isbn" text,
	"isbn13" text,
	"title" text NOT NULL,
	"publication_year" integer,
	"publisher" text,
	"image_url" text,
	"description" text,
	"num_pages" integer,
	"language_code" text,
	"text_reviews_count" integer,
	"ratings_count" integer,
	"average_rating" numeric(3, 2),
	"series" text[],
	"popular_shelves" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" json,
	"embedding" vector(1536)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_to_author" ADD CONSTRAINT "book_to_author_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_to_author" ADD CONSTRAINT "book_to_author_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
