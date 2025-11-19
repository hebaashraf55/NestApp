import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from 'src/DB/models/brand.model';
import { Product } from 'src/DB/models/product.model';
import { Category } from 'src/DB/models/category.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Brand.name) private brandModel : Model<Brand>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel : Model<Category>)
 {}
  async create(
    createProductDto: CreateProductDto, 
    userId : Types.ObjectId, 
    files: Express.Multer.File[]
  ) {
    const brandExists = await this.brandModel.findById(createProductDto.brands);
    if(!brandExists) throw new BadRequestException('Brand does not exist');

    const categoryExists = await this.categoryModel.findById(createProductDto.category);
    if(!categoryExists) throw new BadRequestException('Category does not exist');

    const images : string[] = [];
    if(files?.length){
      for(const file of files) {
        images.push(`./src/uploads/products/${file.filename}`);
      }
    }
    const product = new this.productModel({
      ...createProductDto,
      createdBy : userId,
      images
    });
    await product.save();
    return product;

  }


}
