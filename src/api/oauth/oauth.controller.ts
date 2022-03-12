import {Body, Controller, Headers, Post} from '@nestjs/common';
import {OauthService} from './oauth.service';
import {ApiBasicAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {LoginDto} from '../users/dto/login.dto';

@Controller({
    path: 'oauth',
    version: '1',
})
@ApiTags('OAuth Endpoint')
export class OauthController {
    constructor(private readonly oauthService: OauthService) {}

    @Post('/token')
    @ApiOperation({
        operationId: 'getBasicJwtToken',
        summary: 'Get Basic Jwt Token',
        description: 'Get Basic Jwt Token depends on default credentials',
    })
    @ApiBasicAuth()
    @Post('/token')
    public async getToken(@Headers() headers: Headers): Promise<any> {
        return this.oauthService.getJwtBasicToken(headers);
    }

    @Post('/signin')
    @ApiOperation({
        operationId: 'signIn',
        summary: 'Sign In',
        description: 'Get Basic Jwt Token depends on default credentials',
    })
    signIn(@Body() loginDto: LoginDto): Promise<any> {
        return this.oauthService.signIn(loginDto);
    }
}
