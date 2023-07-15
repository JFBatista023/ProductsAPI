import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource) {}
}
