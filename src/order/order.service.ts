import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from 'src/DB/models/order.model';
import { Cart } from 'src/DB/models/cart .model';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/common/enums/user.enum';
import type { UserDocument } from 'src/DB/models/user.model';
import { PaymentService } from 'src/common/Services/payment/payment.service';
import Stripe from 'stripe';


@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private readonly paymentService : PaymentService,
) {}
  async create(cartId : string, address: string, phone : string ,userId : Types.ObjectId) {
    
    const cart = await this.cartModel.findOne({ _id : cartId , user : userId }).populate('coupon')
    if(!cart) throw new NotFoundException('Cart not found')
    if(!cart.items.length) throw new NotFoundException('Cart is empty')
    const order = await this.orderModel.create({
    user: userId,
    cart : cart._id,
    address,
    phone,
    subtotal : cart.subTotal,
    discount : cart.discount || 0,
    total : cart.totalAfterDiscount || cart.subTotal,
    coupon : cart.coupon?._id || null,
    paymentMethod: PaymentMethodEnum.CASH,
    status : OrderStatusEnum.PLACED
  })

  cart.items = [];
  await cart.save()
  
  return order;

  }

  // create session 
  async createCheckoutSession(orderId: Types.ObjectId, userId:Types.ObjectId){

    const order = await this.orderModel.findOne({
      _id: orderId,
      user: userId,
      status: OrderStatusEnum.PROCISSING,
      paymentMethod: PaymentMethodEnum.CARD,
    }).populate([{ path: 'user' }, { path:'cart' }, { path: 'coupon' }])

    if(!order) throw new NotFoundException('Order Not Found');

    const amount = order.total ?? order.subtotal ?? 0 ;

    const line_items = [{
      price_data : {
        currency : 'egp',
        product_data : {
          name: `Order ${ (order.user as unknown as UserDocument).firstName }`,
          description: `Payment For Order On Address ${order.address}`
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }];
    
    let discounts : Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if(order.discount) {
      const coupon = await this.paymentService.createCoupon({
        duration: 'once',
        currency: 'egp',
        percent_off: order.discount
      })
      discounts.push({coupon : coupon.id})
    }


    const session = await this.paymentService.checkoutSession({
      customer_email: (order.user as unknown as UserDocument).email,
      line_items : line_items,
      mode: 'payment',
      discounts,
      metadata: { orderId: orderId.toString() }
    })

    const method = await this.paymentService.createPaymentMethod({
      type: 'card',
      card: {token : 'tok_visa'}
    })

    const intent = await this.paymentService.createPaymentIntent({
      amount: order.subtotal * 100,
      currency: 'egp',
      payment_method: method.id,
      payment_method_types : [PaymentMethodEnum.CARD]
    })
      order.intentId = intent.id

      await order.save();
      await this.paymentService.confirmPaymentIntent(intent.id)
    return session;

  }

  async refundOrder(orderId:Types.ObjectId, userId: Types.ObjectId) {
    const order = await this.orderModel.findOne({
      _id : orderId,
      user : userId,
      paymentMethod: PaymentMethodEnum.CARD
        })
    if(!order) throw new NotFoundException('Order Does Not Exsist ..')
    if(!order.intentId) throw new BadRequestException('No Payment Intent In This Order')

    const refund = await this.paymentService.createRefund(order.intentId)

    await this.orderModel.findByIdAndUpdate(orderId ,{
      status: OrderStatusEnum.CANCELLED,
      refundId: refund.id ,
      refundedAt: new Date(),
      $unset : { intentId : true},
      $inc : { __v : 1}
    }, {new : true})
    return refund;
  }
    


}
