import {forwardRef, Module} from '@nestjs/common';
import {OauthService} from './oauth.service';
import {OauthController} from './oauth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './strategies/jwt.strategy';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: 'yool@rn',
            signOptions: {
                expiresIn: '7d',
            },
        }),
        PassportModule.register({defaultStrategy: 'jwt'}),
        forwardRef(() => UsersModule),
    ],
    controllers: [OauthController],
    providers: [OauthService, JwtStrategy],
    exports: [OauthService, JwtStrategy, PassportModule],
})
export class OauthModule {}
