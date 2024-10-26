import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  providers: [NewsService],
  imports: [PrismaModule],
  controllers: [NewsController],
})
export class NewsModule {}
