/**
 * Project yoolearn-backend
 * File get-user.decorator
 * Path src/decorator
 * Created by BRICE ZELE
 * Date: 23/08/2021
 */
import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import { User } from "../api/users/entities/user.entity";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);
