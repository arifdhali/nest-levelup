import { ParseIntPipe } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class updateDTO {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    stock: number;


    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(0)
    price: number;
}