import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'src/entities/product.entity';
import { ProductDTO } from 'src/dto/product.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt/jwt-auth.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { RolePermissions } from 'src/enums/roles.enum';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Permissions(RolePermissions.LIST_PRODUCT)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Post()
  @Permissions(RolePermissions.CREATE_PRODUCT)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async createProduct(
    @Body(new ValidationPipe({ transform: true })) newProduct: ProductDTO,
  ) {
    await this.productsService.create(newProduct);
  }

  @Put(':id')
  @Permissions(RolePermissions.UPDATE_PRODUCT)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ transform: true })) product: ProductDTO,
  ) {
    const updatedProduct = await this.productsService.update(id, product);

    if (!updatedProduct) {
      throw new NotFoundException({ message: 'Product not found.' });
    }

    return { message: 'Product updated successfully.' };
  }

  @Delete(':id')
  @Permissions(RolePermissions.DELETE_PRODUCT)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    const deletedResult = await this.productsService.delete(id);

    if (!deletedResult) {
      throw new NotFoundException({ message: 'Product not found.' });
    }

    return { message: 'Product deleted successfully.' };
  }
}
