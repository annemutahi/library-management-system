# Library Management System

## Catalog data layer

The API uses Prisma with PostgreSQL. From `api/`, install dependencies and generate the Prisma Client:

```sh
npm install
npm run prisma:generate
```

Copy `.env.example` to `.env` and set `DATABASE_URL` to the PostgreSQL connection string for your database. Keep `.env` private and never commit real credentials.

For a development database, create and apply a migration with `npm run db:migrate`. To apply checked-in migrations to a hosted database, run `npm run db:deploy`, then populate the catalog with `npm run db:seed`. The seed can be run repeatedly; genres and books are upserted by their unique names and ISBNs.

## Schema Decisions

`Book` references `Genre` using the `genreId` foreign key rather than embedding genre details in each book. A genre is shared by many books, so storing it once avoids duplicated or inconsistent genre names and descriptions. The relation also lets PostgreSQL enforce that every book points to an existing genre, while making it straightforward to query a genre and its books.

The `User` model uses the `Role` enum so only the supported `PATRON` and `LIBRARIAN` values can be stored. Book ISBNs, genre names, and user emails are unique identifiers.

One difference from a document database is that Prisma models this catalog as related records and explicit foreign keys. A book's genre is loaded through a relation instead of being copied into an embedded document, and the database can enforce referential integrity.

## API

The NestJS API runs from `api/`. Copy `.env.example` to `.env`, set both
`DATABASE_URL` and a private, long-random `JWT_SECRET`, then generate the client
and apply migrations:

```sh
npm install
npm run prisma:generate
npm run db:deploy
npm run start
```

Authentication is available at `POST /auth/register` and `POST /auth/login`.
Book reads are public; creating, updating, and deleting books require a bearer
token issued to a `LIBRARIAN` account. Book listing accepts `genreId`,
`search` (matching title or author), `page`, and `limit` query parameters.
Genre and book CRUD requests and the authentication requests are available in
`docs/postman_collection.json`.

## Client

The React client runs from `client/`. Install its dependencies and start the
Vite development server:

```sh
cd client
npm install
npm run dev
```

The client reads `VITE_API_URL` from `client/.env` (defaulting to
`http://localhost:3000`) to connect to the NestJS API.
