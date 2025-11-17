import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModel } from 'src/DB/models/user.model';
import { CartModel } from 'src/DB/models/cart .model';
import { OrderModel } from 'src/DB/models/order.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import { JwtService } from '@nestjs/jwt';
import { PaymentService } from 'src/common/Services/payment/payment.service';

@Module({
  imports: [UserModel, CartModel, OrderModel, CouponModel, ],
  controllers: [OrderController],
  providers: [OrderService, JwtService, PaymentService],
})
export class OrderModule {}
