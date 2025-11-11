/* eslint-disable @typescript-eslint/await-thenable */
import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';


@Schema({
  timestamps: true,
})
export class Coupon {

 @Prop({
    type: String,
    unique: true,
    required : true,
    trim: true,
    uppercase: true,
    })
    code: string;


    @Prop({
        type: Number,
        required: true,
        min: 1,
        max: 100,
    })
    discountPersent : number;

    @Prop({
        type: Date,
        required: true,
    })
    expiresAt: Date;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    })
    createdBy : Types.ObjectId;




}

export const couponSchema = SchemaFactory.createForClass(Coupon);
export type CouponDocument = HydratedDocument<Coupon>;
export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: couponSchema },
]);
