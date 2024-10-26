import { AppService } from './app.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/address_jis')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'zipcode', required: true })
  async addressJis(@Query('zipcode') zipcode: string) {
    const response = await this.httpService.axiosRef.get(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`,
    );
    return { data: response.data };
  }
}
