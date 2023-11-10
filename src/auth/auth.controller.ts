import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {
        
    }
    //Nhan request tu client
    @Post("register")
    register(@Body() authDTO: AuthDTO) {
        //Body la mot "Data Transfer Object" - DTO
        //Controller se goi 'service'
        
        return this.authService.register(authDTO);
    } 
        
    @Post("login") 
    login(@Body() authDTO: AuthDTO) {
        return this.authService.login(authDTO);
    }
}