import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from 'src/repositories/product.repository';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    AuthModule,
    UsersModule,
    JwtModule,
  ],
  providers: [ProductsService, ProductRepository, PermissionsGuard],
  controllers: [ProductsController],
})
export class ProductsModule {}
