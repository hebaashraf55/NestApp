import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addToCart(
    @Body() body : { productId : string, quantity : number}, 
    @Req() req) {
    const userId = req.user._id
    return this.cartService.addToCart(userId , body.productId, body.quantity);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':productId')
  updateCart(
    @Req() req,
    @Param('productId') productId: string,
    @Body('quantity') quantity : number) {
      const userId = req.user._id 
    return this.cartService.updateCart(userId, productId, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
