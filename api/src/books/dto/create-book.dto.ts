import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  author!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  isbn!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publicationYear?: number;
}
