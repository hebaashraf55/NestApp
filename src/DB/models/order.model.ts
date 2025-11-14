/* eslint-disable @typescript-eslint/await-thenable */
import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/common/enums/user.enum';
import { object } from 'zod';


@Schema({
  timestamps: true,
})
export class Order {

 @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'User',
    })
    user:Types.ObjectId;

 @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Cart',
    })
    cart:Types.ObjectId;

 @Prop({
    type: Number,
    required : true,
    ref: 'Cart',
    })
   subtotal :number;

 @Prop({
    type: String,
    default : 0
 })
 discount : number;

 @Prop({
    type: String,
    required : true,
    ref: 'Cart',
    })
    total :number;

 @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Coupon',
    })
    coupon?:Types.ObjectId;
     
 @Prop({
    type: String,
    required : true,
    enum:{ 
        values: Object.values(OrderStatusEnum),
        message: '{VALUE} is not supported'
    },
    default : OrderStatusEnum.PLACED
    })
    status: string;

 @Prop({
    type: String,
    required : true,
    enum:{ 
        values: Object.values(PaymentMethodEnum),
        message: '{VALUE} is not supported'
    },
    default : PaymentMethodEnum.CASH_ON_DELIVERY
    })
    paymentMethod: string;


 @Prop({
    type: String,
    required : true,
    })
    address: string;

 @Prop({
    type: String,
    required : true,
    })
    phone: string; 

}

export const orderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;
export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: orderSchema },
]);
