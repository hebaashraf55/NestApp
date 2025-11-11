import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/DB/models/cart .model';
import { Product } from 'src/DB/models/product.model';
import { Coupon } from 'src/DB/models/coupon.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}

  async addToCart(userId : string, productId : string, quantity : number) {

    const product = await this.productModel.findById(new Types.ObjectId(productId));
    if(!product) throw new NotFoundException('Product not found')
       const price : any = product.salePrice; 
       const total = price * quantity;      

    let cart = await this.cartModel.findOne({ user : userId });
    if(!cart){
      cart = await this.cartModel.create({
        user : userId,
        items : [{ product : productId, quantity, price, total }],
        subTotal : total
      }) ;
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total += cart.items[itemIndex].price * quantity;
      }else {
        cart.items.push({ product : new Types.ObjectId(productId), quantity, price, total });
      }
    }
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();
    return cart;
  }

  async findOne(userId: Types.ObjectId) {
    const cart = await this.cartModel
    .findOne({ user : userId })
    .populate({ path :'items.product' , select : 'name salePrice slug images -_id' });
    if(!cart) throw new NotFoundException('Cart not found')
    return cart;
  }

  async updateCart(userId : Types.ObjectId , productId : string, quantity : number) {
    const cart = await this.cartModel.findOne({ user : userId });
    if(!cart) throw new NotFoundException('Cart not found')

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId)
    if(itemIndex === -1) throw new NotFoundException('Product not found in cart ...')

    if(quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex]
      item.quantity = quantity;
      item.total = item.price * item.quantity;

      }
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();
    return cart;

  }

  async remove(userId: Types.ObjectId, productId : string) {
     const cart = await this.cartModel.findOne({ user : userId });
     if(!cart) throw new NotFoundException('Cart not found')
      const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId)
    if (itemIndex === -1) throw new NotFoundException('Product not found in cart ...')
    cart.items.splice(itemIndex,1);
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();
    return cart;
    
  }


  async applyCoupon (userId : Types.ObjectId , code: string){
    const cart = await this.cartModel.findOne({ user : userId });
    if(!cart) throw new NotFoundException('Cart not Found')

    const coupon = await this.couponModel.findOne({ code });
    if(!coupon) throw new NotFoundException('Coupon not found');

    const now = new Date();
    if(coupon.expiresAt < now ) throw new BadRequestException('Coupon Expired')

    const discountAmount = (cart.subTotal * coupon.discountPersent) / 100;

    const totalAfterDiscount = cart.subTotal - discountAmount;

    cart.discount = coupon.discountPersent ;
    cart.coupon = coupon._id;
    cart.totalAfterDiscount = totalAfterDiscount;

    await cart.save();
    return cart;

  }


}
