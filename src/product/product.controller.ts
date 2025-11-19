import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, UploadedFiles, Req, UseGuards, Inject } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { RedisClientType } from 'redis';


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('images', 4 ,{ 
    storage : diskStorage({
      destination : './src/uploads/products',
      filename : (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}-${ext}`
        cb(null, filename)
      }
    }),
        fileFilter : (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) 
        return cb (new BadRequestException ('File must be an image'), false);
     cb (null, true);
     }
    }))
  @UseGuards(AuthGuard)
  create(
    @Body() createProductDto: CreateProductDto, 
    @UploadedFiles() files : Express.Multer.File[],
    @Req() req,
  ) {
      const userId = req.user._id
    return this.productService.create(createProductDto, userId, files);
  }


  @Get('test')
  async test(){
    let user = JSON.parse( (await this.redisClient.get('user') ) as string);
    if(!user) {
      user = {message : `Done at ${Date.now()}`, username: "Heba"}
      await this.redisClient.set("user", JSON.stringify(user), { expiration : { type : 'EX', value : 5} })
    }
    return user;
  }

}
