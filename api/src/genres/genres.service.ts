import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGenreDto: CreateGenreDto) {
    return this.prisma.genre.create({ data: createGenreDto });
  }

  findAll() {
    return this.prisma.genre.findMany({ include: { books: true } });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre ${id} not found`);
    }
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);
    return this.prisma.genre.update({ where: { id }, data: updateGenreDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}
