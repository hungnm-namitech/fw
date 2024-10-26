import { Module } from '@nestjs/common';
import { SchedulersService } from './schedulers.service';
import { SchedulersController } from './schedulers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';

@Module({
  providers: [PrismaService, StorageService, SchedulersService],
  controllers: [SchedulersController],
})
export class SchedulersModule {}
