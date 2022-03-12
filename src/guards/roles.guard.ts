/**
 * Project yoolearn-backend
 * File roles.guard
 * Path src/guards
 * Created by BRICE ZELE
 * Date: 22/08/2021
 */
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Role} from '../enum/role.enum';
import {ROLES_KEY} from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler, context.getClass()],
        );

        const {user} = context.switchToHttp().getRequest();
        if (!requiredRoles) return true;

        return user
            ? requiredRoles.some(role => user.roles?.includes(role))
            : false;
    }
}
