import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const genreData = [
  { name: "Fiction", description: "Literary and contemporary fiction." },
  { name: "Fantasy", description: "Myths, magic, and imagined worlds." },
  { name: "History", description: "Accounts of people and events from the past." },
  { name: "Science", description: "Accessible introductions to scientific ideas." },
];

const bookData = [
  { title: "The Glass Harbor", author: "Mara Ellis", isbn: "9780000000001", publicationYear: 2018, genre: "Fiction" },
  { title: "A Map of Quiet Streets", author: "Jonah Reed", isbn: "9780000000002", publicationYear: 2020, genre: "Fiction" },
  { title: "The Last Orchard", author: "Nina Vale", isbn: "9780000000003", publicationYear: 2016, genre: "Fiction" },
  { title: "Letters from the North", author: "Elias Hart", isbn: "9780000000004", publicationYear: 2022, genre: "Fiction" },
  { title: "The Clockwork Grove", author: "Ari Rowan", isbn: "9780000000005", publicationYear: 2019, genre: "Fantasy" },
  { title: "Crown of Ember", author: "Tessa Wren", isbn: "9780000000006", publicationYear: 2017, genre: "Fantasy" },
  { title: "The Moonlit Archive", author: "Calder Moss", isbn: "9780000000007", publicationYear: 2021, genre: "Fantasy" },
  { title: "Isles of the Wandering Star", author: "Mira Sol", isbn: "9780000000008", publicationYear: 2023, genre: "Fantasy" },
  { title: "A City Through Centuries", author: "Ruth Bennett", isbn: "9780000000009", publicationYear: 2015, genre: "History" },
  { title: "The Silk Road at Dawn", author: "Owen Clarke", isbn: "9780000000010", publicationYear: 2019, genre: "History" },
  { title: "Letters from an Old Republic", author: "Leah Grant", isbn: "9780000000011", publicationYear: 2014, genre: "History" },
  { title: "The Shape of Time", author: "Peter Rowan", isbn: "9780000000012", publicationYear: 2022, genre: "History" },
  { title: "Small Wonders of Physics", author: "Dr. Ada Finch", isbn: "9780000000013", publicationYear: 2020, genre: "Science" },
  { title: "A Field Guide to the Night Sky", author: "Samir Patel", isbn: "9780000000014", publicationYear: 2018, genre: "Science" },
  { title: "The Living Cell", author: "Elena Brooks", isbn: "9780000000015", publicationYear: 2021, genre: "Science" },
  { title: "Patterns in the Natural World", author: "Noah Kim", isbn: "9780000000016", publicationYear: 2017, genre: "Science" },
];

async function main(): Promise<void> {
  const genres = await Promise.all(
    genreData.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: { description: genre.description },
        create: genre,
      }),
    ),
  );
  const genreIds = new Map(genres.map((genre) => [genre.name, genre.id]));

  for (const { genre: genreName, ...book } of bookData) {
    const genreId = genreIds.get(genreName);
    if (genreId === undefined) {
      throw new Error(`Seed book references unknown genre: ${genreName}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: { ...book, genreId },
      create: { ...book, genreId },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
