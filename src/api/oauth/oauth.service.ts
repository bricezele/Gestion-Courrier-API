import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {JwtPayload} from '../../interfaces/jwt.payload';
import {User} from '../users/entities/users.entity';
import {Role} from '../../enum/role.enum';
import {LoginDto} from '../users/dto/login.dto';
import {I18nService} from 'nestjs-i18n';
import {UsersService} from '../users/users.service';
import jwt_decode from 'jwt-decode';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OauthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly i18n: I18nService,
    ) {
    }

    public async getJwtBasicToken(headers) {
        const user = await this.validateUserByBasicJwt(headers);

        if (!user) throw new UnauthorizedException();
        else return user;
    }

    public createJwtPayload(user: User) {
        const jwt = this.jwtService.sign({email: user.email});

        return {
            expiresIn: Number(process.env.JWT_EXPIRES_IN),
            accessToken: jwt,
            user: user,
            status: 200,
        };
    }

    public async validateUserByDefaultEmail(email) {
        if (email) {
            const user = await this.usersService.findOneByEmail(email);
            return this.createJwtPayload(user);
        }
    }

    public async validateUserByBasicJwt(header?) {
        const user = new User();
        if (header) {
            if (this.getBasicAuthCredential(header) !== null) {
                const {email, password} = this.getBasicAuthCredential(header);
                if (email) {
                    if (
                        email === process.env.JWT_SECRET_LOGIN &&
                        password === process.env.JWT_SECRET_KEY
                    ) {
                        user.email = email;
                        user.password = password;
                        user.roles = Role.ADMIN;
                        return this.createJwtPayload(user);
                    } else return null;
                } else return null;
            } else return null;
        }
    }

    private getBasicAuthCredential(header): JwtPayload {
        if (header.authorization && header.authorization.includes('Basic')) {
            const base64Credentials = header.authorization.split(' ')[1];
            const credentials = Buffer.from(
                base64Credentials,
                'base64',
            ).toString('ascii');
            const [username, password] = credentials.split(':');

            return {
                email: username,
                password: password,
            };
        } else if (
            header.authorization &&
            header.authorization.includes('Bearer')
        ) {
            let decoded = jwt_decode(header.authorization.split(' ')[1]);
            return {
                email: decoded['email'],
                password: process.env.JWT_SECRET_KEY,
            };
        } else return null;
    }

    async signIn(loginDto: LoginDto): Promise<any> {
        const user = await this.validateUserPassword(loginDto);
        if (!user) {
            const errorMessage = await this.i18n.t(
                'exceptions.INVALID_CREDENTIAL',
            );
            throw new UnauthorizedException(errorMessage);
        }

        //const payload: JwtPayload = {email: user.email};
        return this.createJwtPayload(user);
    }

    async validateUserPassword(loginDto: LoginDto): Promise<User> {
        const {email, password} = loginDto;
        const user = await this.usersService.findOneByEmail(email);
        console.log('User', user);
        const hash = await bcrypt.hash(password, user.salt);
        if (
            (user && (await hash) === user.password) ||
            (user && password === user.password)
        ) {
            return user;
        }
    }
}
