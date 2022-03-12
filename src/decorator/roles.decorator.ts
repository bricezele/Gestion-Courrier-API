/**
 * Project yoolearn-backend
 * File roles
 * Path src/decorator
 * Created by BRICE ZELE
 * Date: 22/08/2021
 */
import {Role} from '../enum/role.enum';
import {SetMetadata} from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: Role[]) =>
    SetMetadata(ROLES_KEY, roles);
