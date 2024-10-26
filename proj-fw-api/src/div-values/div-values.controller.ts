import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DivValuesService } from './div-values.service';
import { DivValueItemListDto } from './response/div-values.dto';

@ApiTags('div-values')
@Controller('div-values')
export class DivValuesController {
  constructor(private divValuesService: DivValuesService) {}
  @ApiResponse({
    description: 'List div value',
    type: DivValueItemListDto,
    isArray: true,
  })
  @Get()
  getDivValuesByDivCd() {
    // Get car type
    const divCd = '00001';
    return this.divValuesService.getDivValuesByDivCd(divCd);
  }
}
