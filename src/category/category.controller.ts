import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors, ValidationPipe, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image', { 
    storage : diskStorage({
      destination : './src/uploads/categories',
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
  create(
    @Body(new ValidationPipe) createCategoryDto: CreateCategoryDto, 
    @UploadedFile() file : Express.Multer.File) {
      const imagePath = file.path;
    return this.categoryService.create(createCategoryDto, imagePath);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
