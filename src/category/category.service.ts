import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/DB/models/category.model';
import { Model, Types } from 'mongoose';
import { Brand } from 'src/DB/models/brand.model';


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel : Model<Brand>
  ){}
   async create( createCategoryDto : CreateCategoryDto, image: string) {
    const category = await this.categoryModel.findOne({
      name : createCategoryDto.name,
    })
    if(category) return new ConflictException('Category Already Exsits')
    if(createCategoryDto.brands && createCategoryDto.brands.length > 0) {
      const invalidId = createCategoryDto.brands.find((id) => !Types.ObjectId.isValid(id));
      if(invalidId) return new BadRequestException('Invalid Brand Id Format')
      const founBrands = await this.brandModel.find({
        _id : { $in : createCategoryDto.brands }
         })
      if(founBrands.length !== createCategoryDto.brands.length) {
        const foundIds =  founBrands.map((b) => b._id.toString())
        const missing = createCategoryDto.brands.filter((id)=> !foundIds.includes(id.toString()))
        throw new BadRequestException(`These Brands Does Not Exsits ${missing.join(', ')}`)
      }
    }
    const NewCategory = await this.categoryModel.create({
      ...createCategoryDto, 
      image,
    })
    return NewCategory;
  }

  async findAll() {
    return await this.categoryModel.find()
    .populate({path :'brands', select : 'name image -_id'});
  }

  async findOne(id: string) {
    return await this.categoryModel.findById(id)
    .populate({path :'brands', select : 'name image -_id'});
  }

  update(id: number, UpdateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
