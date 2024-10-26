import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederGuard } from './seeder.guard';
import { ISeederDataUser, ISeederItemGroup } from './seeder.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('seeder')
@Controller('seeder')
export class SeederController {
  constructor(private seederService: SeederService) { }

  @UseGuards(SeederGuard)
  @Post('admin')
  seedAdmin() {
    const data: ISeederDataUser = {
      userId: 'admin123',
      username: 'admin123',
      usernameKana: 'admin123',
      mailAddress: 'admin123@gmail.com',
      tel: '0345667867',
      roleDiv: '1',
      password: '$2a$10$AssZySg5rB1p0ObG1ncxm.JBJQ/VC9wQYGvQZW/cMvQjgwWUmXr3u',
    };
    return this.seederService.createSeeder(data);
  }

  @UseGuards(SeederGuard)
  @Post('order')
  seedOrder() {
    return this.seederService.createOrderDetail();
  }
}
