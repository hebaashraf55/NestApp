import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    images: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    originalPrice: number;

    @IsNumber() @Type(() => Number) 
    discountPersent: number;

    @IsNumber()
    @Type(() => Number)
    salePrice?: number;

    @IsNumber()
    @Type(() => Number)
    stock: number;

    // @IsNumber()
    // @Type(() => Number)
    // soldItems: number;
    
    @IsMongoId()
    @IsOptional()
    category: Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    brands: Types.ObjectId[];
}
