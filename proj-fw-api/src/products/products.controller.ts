import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ItemGroupDetailQuery } from './dto/request/item-group-detail-query.dto';
import { ItemGroupDto } from './dto/response/item-groups.dto';
import { ProductService } from './products.service';
import { RequestUser } from 'src/users/user.decorator';
import { ItemGroupDetailDto } from './dto/response/item-group-detail.dto';
import { ItemGroupNameDto } from './dto/response/list-item-group-name';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('item-groups')
@Controller('item-groups')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiResponse({
    description: 'List items',
    type: ItemGroupDto,
    isArray: true,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getItems(@RequestUser() user: UserJwt) {
    return this.productService.getItems(user);
  }

  @ApiResponse({
    description: 'List product name',
    type: ItemGroupNameDto,
    isArray: true,
  })
  @Get('names')
  @UseGuards(JwtAuthGuard)
  getItemNames(@RequestUser() user: UserJwt) {
    return this.productService.getItemNames(user);
  }

  @ApiResponse({
    description: 'Product detail',
    type: ItemGroupDetailDto,
  })
  @Get(':itemCd')
  @UseGuards(JwtAuthGuard)
  getProductDetail(
    @Param('itemCd') itemCd: string,
    @Query() query: ItemGroupDetailQuery,
    @RequestUser() user: UserJwt,
  ) {
    return this.productService.getItemDetail(
      itemCd,
      query.commercialFlowId,
      user,
    );
  }
}
