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
import { CreateBaseDto } from 'src/bases/dto/request/create-base.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { BasesQueryDto } from './dto/request/bases-query.dto';
import { ListBaseDto, BaseDetailDto } from './dto/response/bases.dto';
import { BasesService } from './bases.service';
import { UpdateBaseDto } from './dto/request/update-base.dto';
import { RequestUser } from 'src/users/user.decorator';

@ApiTags('bases')
@Controller('bases')
export class BasesController {
  constructor(private basesService: BasesService) {}

  @ApiResponse({
    description: 'List bases',
    type: ListBaseDto,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getBases(
    @RequestUser() requestUser: UserJwt,
    @Query() query: BasesQueryDto,
  ): Promise<ListBaseDto> {
    return this.basesService.getListBase(query, requestUser);
  }

  @ApiResponse({
    description: 'Find a base',
    type: BaseDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBase(
    @RequestUser() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<BaseDetailDto> {
    const base = await this.basesService.getBaseDetail(id, requestUser);

    return {
      ...base,
      id: base.id,
      baseName: base.baseName,
      baseDiv: Number(base.baseDiv),
      companyCd: String(base.companyCd),
      tel: base.telNumber,
      postCode: String(base.postCd),
      address1: base.address1,
      address2: base.address2,
      address3: base.address3,
    };
  }

  @Post()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createBase(@Request() req, @Body() body: CreateBaseDto) {
    return this.basesService.createBase(body, req.user as UserJwt);
  }

  @Patch(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBase(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body() body: UpdateBaseDto,
  ) {
    return this.basesService.updateBase(body, id, requestUser);
  }

  @Delete(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW, USER_ROLE.PC])
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteBase(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ) {
    return this.basesService.deleteBase(id, requestUser);
  }
}
