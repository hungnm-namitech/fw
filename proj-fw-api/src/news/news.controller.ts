import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewItemListDto } from './response/news.dto';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @ApiResponse({
    description: 'List new',
    type: NewItemListDto,
    isArray: true,
  })
  @Get()
  getNews() {
    return this.newsService.getNews();
  }
}
