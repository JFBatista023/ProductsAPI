import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  price_in_cents: number;

  @Column({ default: 0 })
  quantity: number;
}
