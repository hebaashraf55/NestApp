import { IsString, Length, IsNotEmpty, IsOptional, IsMongoId, IsArray } from "class-validator";
import { Types } from "mongoose";

export class CreateCategoryDto {
    @IsString()
    @Length(3,25)
    @IsNotEmpty()
    name: string;

    @IsString()
    @Length(3,1000)
    @IsOptional()
    description?: string;

    @IsMongoId()
    createdBy: Types.ObjectId;

    // @IsOptional()
    // @IsArray()
    // @IsMongoId({ each : true })
    brands?: Types.ObjectId[];
}
