import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from 'src/repositories/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService, ProductRepository],
  controllers: [ProductsController],
})
export class ProductsModule {}
