import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, Put,
    Query,
    Req,
    UseGuards
} from "@nestjs/common";
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Request} from 'express';
import {RolesGuard} from '../../guards/roles.guard';
import {JwtAuthGuard} from '../../guards/jwt-auth.guard';
import {User} from './entities/user.entity';

@Controller({
    path: 'users',
    version: '1',
})
@ApiBearerAuth()
@ApiTags('User Endpoint')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiBody({type: CreateUserDto})
    @ApiOperation({
        operationId: 'createUser',
        summary: "Creation d'un utilisateur",
        description: "Création d'un nouveau utilisateur",
    })
    @ApiCreatedResponse({
        description: 'Succes création utilisateur',
        type: CreateUserDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    create(
        @Req() req: Request,
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.usersService.create(req, createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('/check-admin-exist')
    checkIfUserAdminExist() {
        return this.usersService.checkIfUserAdminExist();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
