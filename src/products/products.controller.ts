import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import { ProductDTO } from 'src/dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Post()
  async createProduct(@Body(new ValidationPipe()) newProduct: ProductDTO) {
    await this.productsService.create(newProduct);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body(new ValidationPipe()) product: ProductDTO,
  ) {
    const updatedProduct = await this.productsService.update(id, product);

    if (!updatedProduct) {
      throw new NotFoundException({ message: 'Product not found.' });
    }

    return { message: 'Product updated successfully.' };
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const deletedResult = await this.productsService.delete(id);
    console.log(deletedResult);
    if (!deletedResult) {
      throw new NotFoundException({ message: 'Product not found.' });
    }

    return { message: 'Product deleted successfully.' };
  }
}
