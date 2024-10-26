import {
  Body,
  Controller,
  Get,
  UseGuards,
  Query,
  HttpStatus,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { ListSupplierDto, SupplierDto, SupplierDetailDto, ParentSupplierDto } from './dto/response/suppliers.dto';
import { SuppliersQueryDto } from './dto/request/suppliers-query.dto';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto } from './dto/request/update-supplier.dto';
import { UserJwt } from 'src/auth/auth.interface';
import { RequestUser } from 'src/users/user.decorator';
import { SupplierTransformInterceptor } from 'src/suppliers/suppliers.interceptor';

@UseInterceptors(new SupplierTransformInterceptor())
@ApiTags('suppliers')
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @ApiResponse({
    description: 'Get all suppliers',
    type: SupplierDto,
    isArray: true,
  })
  @Get('all')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllSupplier(): Promise<SupplierDto[]> {
    return this.suppliersService.getAllSupplier();
  }

  @ApiResponse({
    description: 'Get all suppliers',
    type: SupplierDto,
    isArray: true,
  })
  @Get('all_parent')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllParentSupplier(): Promise<ParentSupplierDto[]> {
    return this.suppliersService.getAllParentSupplier();
  }

  @ApiResponse({
    description: 'Get supplier',
    type: SupplierDto,
    isArray: true,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCompanies(
    @RequestUser() requestUser: UserJwt,
    @Query() query: SuppliersQueryDto,
  ): Promise<ListSupplierDto> {
    return this.suppliersService.getListSupplier(query, requestUser);
  }

  @ApiResponse({
    description: 'Find a supplier',
    type: SupplierDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSupplier(
    @RequestUser() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<SupplierDetailDto> {
    const supplier = await this.suppliersService.getSupplierDetail(id, requestUser);

    return  { ...supplier,
      supplierCd: supplier.supplierCd,
      supplierName: supplier.supplierName,
      supplierNameKana: supplier.supplierNameKana,
      tel: supplier.tel,
      postCd: supplier.postCd,
      address1: supplier.address1,
      address2: supplier.address2,
      address3: supplier.address3,
    };
  }

  @Patch(':supplierCd')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateSupplier(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'supplierCd',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body() body: UpdateSupplierDto,
  ) {
    return this.suppliersService.updateSupplier(body, id, requestUser);
  }
}
