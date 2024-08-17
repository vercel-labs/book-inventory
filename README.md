# Next.js Book Inventory

Demo: https://next-books-search.vercel.app

This is a simple book inventory app built with Next.js, Drizzle, and PostgreSQL. The database contains over 50,000 books from the included `books.csv` file.

## Database Setup

This is currently using a Postgres extension called `unaccent` to remove accents from the book titles. To install this extension, run the following command on your database:

```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
```

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/templates/next.js/next-book-inventory)
