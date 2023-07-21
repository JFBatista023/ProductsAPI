import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductDTO } from 'src/dto/product.dto';
import { Product } from 'src/entities/product.entity';
import { ProductRepository } from 'src/repositories/product.repository';
import { UpdateResult } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ where: { isActive: true } });
  }

  async create(product: ProductDTO): Promise<void> {
    const productExists = await this.productRepository.findOneBy({
      name: product.name,
    });

    if (productExists) {
      throw new BadRequestException(
        'There is already a registered product with the same name.',
      );
    }

    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
  }

  async update(id: string, product: ProductDTO): Promise<Product | null> {
    const updatedProduct = await this.productRepository.findOneBy({
      id,
      isActive: true,
    });

    if (updatedProduct) {
      updatedProduct.name = product.name;
      updatedProduct.price_in_cents = product.price_in_cents;
      return this.productRepository.save(updatedProduct);
    }

    return null;
  }

  async delete(id: string): Promise<UpdateResult | null> {
    const deletedProduct = await this.productRepository.findOneBy({ id });

    if (deletedProduct) return this.productRepository.softDelete(id);

    return null;
  }
}
