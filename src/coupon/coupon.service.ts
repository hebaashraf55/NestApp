import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from 'src/DB/models/coupon.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon> ) {}
  async create(createCouponDto: CreateCouponDto, userId: Types.ObjectId) {
        const exsitsCoupon = await this.couponModel.findOne({
          code : createCouponDto.code   
        })
        if(exsitsCoupon) throw new ConflictException ('Coupon Already Exsits')
        const coupon = await this.couponModel.create({
      ...createCouponDto , 
      code : createCouponDto.code,
      createdBy : userId })

   return coupon;

  }

  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
