import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { USER_ROLE } from 'src/constants/common';
import { SchedulersService } from './schedulers.service';

@ApiTags('schedulers')
@Controller('schedulers')
export class SchedulersController {
  constructor(private schedulersServices: SchedulersService) {}

  @Post('bulk-insert')
  @Roles([USER_ROLE.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulkInsertProducts() {
    return this.schedulersServices.bulkInsertItems();
  }
}
