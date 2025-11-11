import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { UserModel } from 'src/DB/models/user.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel, CouponModel],
  controllers: [CouponController],
  providers: [CouponService, JwtService],
})
export class CouponModule {}
