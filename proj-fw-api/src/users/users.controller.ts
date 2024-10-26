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
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwt } from 'src/auth/auth.interface';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { UsersQueryDto } from './dto/request/users-query.dto';
import { ListUserDto, UserDetailDto } from './dto/response/users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User } from '@prisma/client';
import { omit } from 'lodash';
import { RequestUser } from 'src/users/user.decorator';
import { ValidationPipe } from './validation.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @ApiResponse({
    description: 'List users',
    type: ListUserDto,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUsers(
    @RequestUser() requestUser: UserJwt,
    @Query() query: UsersQueryDto,
  ): Promise<ListUserDto> {
    return this.usersService.getListUser(query, requestUser);
  }

  @ApiResponse({
    description: 'Find a user',
    type: UserDetailDto,
  })
  @Get(':id')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(
    @RequestUser() requestUser: UserJwt,
    @Param('id', ParseIntPipe) id,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.getUserDetail(id, requestUser.roleDiv);

    return omit(user, 'password');
  }

  @Post()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createUser(
    @RequestUser() requestUser: UserJwt, 
    @Body(new ValidationPipe()) body: CreateUserDto,
  ) {
    return this.usersService.createUser(body, requestUser);
  }

  @Patch(':mUserId')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUser(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'mUserId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    mUserId: number,
    @Body(new ValidationPipe()) body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(body, mUserId, requestUser);
  }

  @Delete(':mUserId')
  @Roles([USER_ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteUser(
    @Param(
      'mUserId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    mUserId: number,
  ) {
    return this.usersService.deleteUser(mUserId);
  }

  @Patch(':mUserId/password-creation')
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  passwordCreation(
    @RequestUser() requestUser: UserJwt,
    @Param(
      'mUserId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    mUserId: number,
  ) {
    return this.usersService.passwordCreation(mUserId, requestUser);
  }
}
