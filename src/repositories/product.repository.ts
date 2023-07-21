import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async softDelete(id: string): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(Product)
      .set({ isActive: false })
      .where('id = :id', { id })
      .execute();
  }
}
