import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { CompaniesService } from './companies.service';
import { CompanyGuard } from './company.guard';
import {
  ListCompanyDto,
  CompanyDto,
  CompanyDetailDto,
} from './dto/response/companies.dto';
import { CompaniesQueryDto } from './dto/request/companies-query.dto';
import { CompanyBaseDto } from './dto/response/bases.dto';
import { CompanyStaffDto } from './dto/response/staffs.dto';
import { CompanyTransformInterceptor } from 'src/companies/companies.interceptor';
import { UserJwt } from 'src/auth/auth.interface';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { RequestUser } from 'src/users/user.decorator';

@UseInterceptors(new CompanyTransformInterceptor())
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @ApiResponse({
    description: 'Get all company',
    type: CompanyDto,
    isArray: true,
  })
  @Get('all')
  @UseGuards(JwtAuthGuard)
  getAllCompany(
    @RequestUser() requestUser: UserJwt,
  ) {
    return this.companiesService.getAllCompany(requestUser);
  }

  @ApiResponse({
    description: 'Get company',
    type: CompanyDto,
    isArray: true,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getCompanies(
    @RequestUser() requestUser: UserJwt,
    @Query() query: CompaniesQueryDto,
  ): Promise<ListCompanyDto> {
    return this.companiesService.getListCompany(query, requestUser);
  }

  @ApiResponse({
    description: 'Find a company',
    type: CompanyDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCompany(
    @RequestUser() requestUser: UserJwt,
    @Param('id') id: string,
  ): Promise<CompanyDetailDto> {
    const company = await this.companiesService.getCompanyDetail(
      id,
      requestUser,
    );

    return {
      ...company,
      id: company.companyCd,
      companyName: company.companyName,
    };
  }

  @ApiResponse({
    description: 'Get all company staff',
    type: CompanyStaffDto,
    isArray: true,
  })
  @Get(':companyCd/staffs')
  @Roles([USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyGuard)
  getAllStaffOfCompany(
    @Param('companyCd')
    companyCd: string,
  ) {
    return this.companiesService.getAllStaffOfCompany(companyCd);
  }

  @ApiResponse({
    description: 'Get all base of company',
    type: CompanyBaseDto,
    isArray: true,
  })
  @Get(':companyCd/bases')
  @Roles([USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyGuard)
  getAllBaseOfCompany(
    @Param('companyCd')
    companyCd: string,
  ) {
    return this.companiesService.getAllBaseOfCompany(companyCd);
  }

  @Patch(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCompany(
    @RequestUser() requestUser: UserJwt,
    @Param('id')
    id: string,
    @Body() body: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(body, id, requestUser);
  }
}
