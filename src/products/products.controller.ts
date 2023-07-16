import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import { CreateProductDTO } from 'src/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Post()
  async createProduct(@Body() newProduct: CreateProductDTO) {
    await this.productsService.create(newProduct);
  }
}
