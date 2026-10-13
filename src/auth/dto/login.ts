import { IsArray, IsEmail, IsEmpty, IsJSON, isNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";



export class LoginDto {
    @IsString()
    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    readonly password: string;
}

export class RegisterDto {
    @IsString()
    readonly name: string

    @IsString()
    @IsEmail()
    email: string


    @IsString()
    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    readonly password: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    user_permission?: string[]

}