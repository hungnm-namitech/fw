import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prismaService: PrismaService) {}

  getNews() {
    const now = new Date();
    return this.prismaService.news.findMany({
      where: {
        publicationStartDate: {
          lt: now,
        },
        publicationEndDate: {
          gt: now,
        },
      },
      select: {
        publicationStartDate: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
