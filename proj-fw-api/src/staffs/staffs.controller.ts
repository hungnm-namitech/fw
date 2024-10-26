import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateStaffDto } from 'src/staffs/dto/request/create-staff.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { StaffsQueryDto } from './dto/request/staffs-query.dto';
import { ListStaffDto, StaffDetailDto } from './dto/response/staffs.dto';
import { StaffsService } from './staffs.service';
import { UpdateStaffDto } from './dto/request/update-staff.dto';
import { RequestUser } from 'src/users/user.decorator';

@ApiTags('staffs')
@Controller('staffs')
export class StaffsController {
  constructor(private staffsService: StaffsService) {}

  @ApiResponse({
    description: 'List staffs',
    type: ListStaffDto,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStaffs(
    @RequestUser() requestUser: UserJwt,
    @Query() query: StaffsQueryDto,
  ): Promise<ListStaffDto> {
    return this.staffsService.getListStaff(query, requestUser);
  }

  @ApiResponse({
    description: 'Find a staff',
    type: StaffDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStaff(
    @RequestUser() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<StaffDetailDto> {
    const staff = await this.staffsService.getStaffDetail(id, requestUser);

    return { ...staff, companyCd: String(staff.companyCd) };
  }

  @Post()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createStaff(@Request() req, @Body() body: CreateStaffDto) {
    return this.staffsService.createStaff(body, req.user as UserJwt);
  }

  @Patch(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStaff(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body() body: UpdateStaffDto,
  ) {
    return this.staffsService.updateStaff(body, id, requestUser);
  }

  @Delete(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteStaff(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    return this.staffsService.deleteStaff(id, requestUser);
  }
}
