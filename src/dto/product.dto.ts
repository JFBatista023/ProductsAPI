import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  price_in_cents: number;
}
