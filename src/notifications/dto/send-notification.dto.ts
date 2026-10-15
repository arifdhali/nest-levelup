import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";



export enum NotificationEvent {
    ORDER_CONFIRMED = 'ORDER_CONFIRMED',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    ORDER_DELIVERED = 'ORDER_DELIVERED',
}


export class sendNotificationsDto {

    @IsArray()
    @ArrayMinSize(1)
    @IsEmail({}, { each: true })
    recipient!: string[];

    @IsEnum(NotificationEvent)
    event: NotificationEvent;


    @IsString()
    @IsNotEmpty()
    message: string;
}