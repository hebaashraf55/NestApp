import { IsNotEmpty, IsNumber, IsString, IsUppercase, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    code : string;

    @IsNumber()
    @Min(1)
    @Max(100)
    discountPersent : number;

    @IsNotEmpty()
    expiresAt : Date;

}
