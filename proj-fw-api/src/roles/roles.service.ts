import { Injectable } from '@nestjs/common';
import { USER_ROLE } from 'src/constants/common';
import { ROLES_DIV } from './roles.constant';

@Injectable()
export class RolesService {
  getRoles(roleDiv: number) {
    if (roleDiv === USER_ROLE.ADMIN) {
      return ROLES_DIV;
    }
    return ROLES_DIV.filter((role) => role.value !== USER_ROLE.ADMIN);
  }
}
