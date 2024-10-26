import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE } from 'src/constants/common';
import { ROLES_DIV } from 'src/roles/roles.constant';

export class RolesDto {
  @ApiProperty({ description: 'Role value', type: Number, enum: USER_ROLE })
  value: number;

  @ApiProperty({
    description: 'Role label',
    type: String,
    enum: ROLES_DIV.map(({ label }) => label),
  })
  label: string;
}
