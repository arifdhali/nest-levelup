import { ParseIntPipe } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class readDTO {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    offset: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    perPage: number;
}