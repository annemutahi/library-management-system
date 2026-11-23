import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BooksModule } from "./books/books.module";
import { GenresModule } from "./genres/genres.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, AuthModule, BooksModule, GenresModule],
})
export class AppModule {}
