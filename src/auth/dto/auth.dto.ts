import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { Db } from "typeorm"

export class AuthDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
    
    
    userName: string
}