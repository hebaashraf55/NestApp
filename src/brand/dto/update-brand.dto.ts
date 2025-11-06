import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsString, Length, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @IsString()
    @Length(3,25)
    name?: string;

    @IsString()
    image?: string ;

    @IsMongoId()
    createdBy?: Types.ObjectId;
}
