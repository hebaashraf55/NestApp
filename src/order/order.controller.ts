import { Controller, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Types } from 'mongoose';
import type { UserDocument } from 'src/DB/models/user.model';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body : {cartId : string, address: string , phone: string }, @Req() req) {
    const userId = req.user._id;
    const { cartId, address, phone } = body;
    return this.orderService.create(cartId, address, phone , userId);
  }

  // create session
  
  @Post('/checkout/:orderId')
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @Param('orderId') orderId: Types.ObjectId, 
    @Req() req, 
  ) {
      const userId = req.user._id;
      const session = await this.orderService.createCheckoutSession(orderId, userId);
   return session;
  }

  @Post('/refund/:orderId')
  @UseGuards(AuthGuard)
  async refundOrder(@Param('orderId') orderId : Types.ObjectId, @Req() req, ){
    const userId = req.user._id
    const refund = await this.orderService.refundOrder(orderId, userId);
    return refund;
  }


}
