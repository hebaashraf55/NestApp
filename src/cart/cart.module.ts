import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModel } from 'src/DB/models/product.model';
import { CartModel } from 'src/DB/models/cart .model';
import { UserModel } from 'src/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CartModel, UserModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
