/**
 * Project yoolearn-backend
 * File jwt-auth.guard
 * Path src/api/oauth/strategies
 * Created by BRICE ZELE
 * Date: 19/08/2021
 */
import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
