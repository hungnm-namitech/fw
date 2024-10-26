import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { RequestUser } from 'src/users/user.decorator';
import { ChangeDeliveryDateRequest } from './dto/request/change-delivery-request.dto';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { OrderRequestValidationDto } from './dto/request/order-request-validation.dto';
import { RequestChangeOrderDto } from './dto/request/request-change-order.dto';
import { SearchOrderParams } from './dto/request/search-order-params.dto';
import { ListOrderDto } from './dto/response/order-list.dto';
import { OrderDetailForPCDto } from './dto/response/order-detail.dto';
import { OrdersService } from './orders.service';
import { OrderTransformInterceptor } from './orders.interceptor';
import { BatchUpdateReplyDeadlineDto } from './dto/request/batch-update-reply-deadline.dto';

@UseInterceptors(OrderTransformInterceptor)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiResponse({
    description: 'Get order list',
    type: ListOrderDto,
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(
    @Request() req,
    @Query() query: SearchOrderParams,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.getOrderList(query, user);
  }

  @Post()
  @Roles([USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(
    @Request() req,
    @Body() body: CreateOrderDto,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.createOrder(body, user);
  }

  @Patch('batch-update-reply-deadline')
  @Roles([USER_ROLE.SUPPLIER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulkUpdateReplyDeadline(
    @Request() req,
    @Body() body: BatchUpdateReplyDeadlineDto,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.bulkUpdateReplyDeadline(body, user);
  }

  @ApiResponse({
    description: 'Get order detail',
    type: OrderDetailForPCDto,
  })
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getOrderDetailForPc(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.getOrderDetail(orderId, user);
  }

  @Patch(':orderId/company-request')
  @Roles([USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOrderByPc(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId,
    @Body() body: RequestChangeOrderDto,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.updateOrderByPc(body, orderId, user);
  }

  @Patch(':orderId/change-delivery-request')
  @Roles([USER_ROLE.SUPPLIER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  changeDeliveryDateRequest(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId,
    @Body() body: ChangeDeliveryDateRequest,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.changeDeliveryDateRequest(body, orderId, user);
  }

  @Patch(':orderId/admin-validation-request')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOrderByFwOrAdmin(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId,
    @Body() body: OrderRequestValidationDto,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.admiValidationRequest(body, orderId, user);
  }

  @Patch(':orderId/supplier-validation-request')
  @Roles([USER_ROLE.SUPPLIER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOrderBySupplier(
    @Request() req,
    @Param('orderId', ParseIntPipe) orderId,
    @Body() body: OrderRequestValidationDto,
    @RequestUser() user: UserJwt,
  ) {
    return this.ordersService.supplierValidationRequest(body, orderId, user);
  }
}
