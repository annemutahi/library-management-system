import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  author?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  isbn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publicationYear?: number;
}
