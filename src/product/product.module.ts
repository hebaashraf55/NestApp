import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from 'src/DB/models/product.model';
import { CategoryModel } from 'src/DB/models/category.model';
import { BrandModel } from 'src/DB/models/brand.model';
import { UserModel } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { createClient } from 'redis';

@Module({
  imports: [ProductModel, BrandModel, CategoryModel, UserModel],
  controllers: [ProductController],
  providers: [ProductService, JwtService, {
    provide : "REDIS_CLIENT",
    useFactory : async () => {
      const client = createClient({
        url : "redis://localhost:6379"
      });
      client.on('error', (err)=> {
        console.log('Redis Client Error', err);
      }),
      await client.connect();
      console.log('Redis Connected Successfully');
      return client; 
    }
  }],
})
export class ProductModule {}
