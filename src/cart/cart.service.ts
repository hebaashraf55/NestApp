import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/DB/models/cart .model';
import { Product } from 'src/DB/models/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async addToCart(userId : string, productId : string, quantity : number) {

    const product = await this.productModel.findById(new Types.ObjectId(productId));
    if(!product) new NotFoundException('Product not found')

    const price : any = product!.salePrice; 
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
      if(itemIndex > -1){
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total += cart.items[itemIndex].price * cart.items[itemIndex].quantity
      } else {
        cart.items.push({ product : new Types.ObjectId(productId), quantity, price, total });

      }
    }
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    await cart.save();
    return cart;


  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
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

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
