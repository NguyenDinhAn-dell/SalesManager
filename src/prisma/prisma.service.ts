import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config/dist';
import { env } from 'process';
@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL')
                }
            }
       })
    }
}
