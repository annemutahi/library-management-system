import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateBookDto } from "./dto/create-book.dto";
import { FindBooksQueryDto } from "./dto/find-books-query.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    const { genreId, publicationYear, ...book } = createBookDto;
    return this.prisma.book.create({
      data: {
        ...book,
        publicationYear: publicationYear ?? new Date().getFullYear(),
        genre: { connect: { id: genreId } },
      },
      include: { genre: true },
    });
  }

  findAll(query: FindBooksQueryDto) {
    const where: Prisma.BookWhereInput = {};
    if (query.genreId !== undefined) {
      where.genreId = query.genreId;
    }
    if (query.search !== undefined) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const page = query.page ?? 1;
    const take = query.limit ?? 20;
    return this.prisma.book.findMany({
      where,
      skip: (page - 1) * take,
      take,
      include: { genre: true },
      orderBy: { id: "asc" },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);
    const { genreId, ...book } = updateBookDto;
    return this.prisma.book.update({
      where: { id },
      data: {
        ...book,
        ...(genreId === undefined ? {} : { genre: { connect: { id: genreId } } }),
      },
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}
