import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from 'src/dto/product.dto';
import { Product } from 'src/entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async create(product: ProductDTO) {
    const newProduct = this.productRepository.create(product);
    await this.productRepository.save(newProduct);
  }

  async update(id: string, product: ProductDTO) {
    try {
      const updatedProduct = await this.productRepository.findOneBy({ id });

      if (updatedProduct) {
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
}
