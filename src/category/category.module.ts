import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { BrandModel } from 'src/DB/models/brand.model';
import { CategoryModel } from 'src/DB/models/category.model';

@Module({
  imports: [ BrandModel, CategoryModel ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
