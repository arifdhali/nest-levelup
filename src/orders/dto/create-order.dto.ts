import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator"

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]

}


export class CreateOrderItemDto {
    @IsInt()
    @Min(1)
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}