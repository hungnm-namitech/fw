import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { RolesDto } from './dto/response/roles.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiResponse({
    description: 'Roles',
    type: RolesDto,
    isArray: true,
  })
  @Get()
  @Roles([USER_ROLE.ADMIN, USER_ROLE.FW])
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRoles(@Request() req): RolesDto[] {
    return this.rolesService.getRoles(req.user.roleDiv);
  }
}
