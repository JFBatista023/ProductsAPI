import { Injectable } from '@nestjs/common';
import { ProductDTO } from 'src/dto/product.dto';
import { Product } from 'src/entities/product.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { DeleteResult, QueryFailedError } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { isActive: true } });
  }

  async create(product: ProductDTO): Promise<void> {
    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
  }

  async update(id: string, product: ProductDTO): Promise<Product | null> {
    try {
      const updatedProduct = await this.productRepository.findOneBy({ id });

      if (updatedProduct && updatedProduct.isActive) {
        updatedProduct.name = product.name;
        updatedProduct.price_in_cents = product.price_in_cents;
        return this.productRepository.save(updatedProduct);
      }

      return null;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return null;
      }
    }
  }

  async delete(id: string): Promise<DeleteResult | null> {
    try {
      const deletedProduct = await this.productRepository.findOneBy({ id });

      if (deletedProduct) return this.productRepository.softDelete(id);

      return null;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return null;
      }
    }
  }
}
