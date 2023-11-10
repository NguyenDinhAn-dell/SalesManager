import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() 
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //cac module khac co the goi duoc PrismaService
})
export class PrismaModule {}
