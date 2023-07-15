import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<number>('DB_PORT');
        const dbUser = configService.get<string>('DB_USER');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbName = configService.get<string>('DB_NAME');

        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUser,
          password: dbPassword,
          database: dbName,
          synchronize: true,
          autoLoadEntities: true,
        };

        return options;
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}
