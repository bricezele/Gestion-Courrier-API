/**
 * Project yoolearn-backend
 * File jwt.strategy
 * Path src/api/oauth/strategies
 * Created by BRICE ZELE
 * Date: 09/08/2021
 */

import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {OauthService} from '../oauth.service';
import { User } from "../../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly oauthService: OauthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            ignoreExpiration: false,
            usernameField: 'email',
            passReqToCallback: true,
        });
    }

    async validate(
        req: Request,
        email: any,
        password: string,
        headers: Headers,
    ): Promise<User> {
        console.log('Email token', email);
        let token = await this.oauthService.validateUserByBasicJwt(req.headers);
        if (!token) {
            token = await this.oauthService.validateUserByDefaultEmail(
                email.email,
            );
            if (!token) throw new UnauthorizedException();
        }

        return token.user;
    }
}
