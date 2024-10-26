import { Reflector } from '@nestjs/core';
import { USER_ROLE } from 'src/constants/common';

export const Roles = Reflector.createDecorator<USER_ROLE[]>();
