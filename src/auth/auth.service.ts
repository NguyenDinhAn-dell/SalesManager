import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDTO } from "./dto";
import * as argon from 'argon2';
import { throwIfEmpty } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { promises } from "dns";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Injectable({})
export class AuthService {
    constructor(
        private primaService: PrismaService,
        private jwtService: JwtService, 
        private configService: ConfigService,   
    ) {

    }
    async register(authDTO: AuthDTO) {
        //ma hoa mat khau
        const hashedPassword = await argon.hash(authDTO.password)
        
        try {
            //them du lieu vao database
            const user = await this.primaService.user.create( {
                data: {
                    email: authDTO.email,
                    userName: authDTO.userName,
                    password: hashedPassword,

                    
                },
                select: {
                    userId: true,
                    userName: true,
                    email: true,
                }
            })
            return 'Register Successful'
        } catch (error) {
            if(error.code == 'P2002') {
                throw new ForbiddenException("User with this email already exists")
            }
        }
    }
    async login(authDTO: AuthDTO) {
        const user = await this.primaService.user.findUnique({
            where: {
                userName: authDTO.userName,
                email: authDTO.email
            }
        })
        if(!user) {
            throw new ForbiddenException(
                "User not found"
            )
        }
        const passwordMatched = await argon.verify(
            user.password,
            authDTO.password
        )
        if(!passwordMatched) {
           throw new ForbiddenException(
                "Password is incorrect"
           )
        }
        delete user.password
        return await this.signJwtToken(user.userId, user.email)
    }
    async signJwtToken(userId: number, email: string)
        :Promise<{accessToken: string}> {
        const payload = {
            sub: userId,
            email: email,
        }
        const jwtString =  await this.jwtService.signAsync(payload, {
            expiresIn: '60m',
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString
        }
    }
}