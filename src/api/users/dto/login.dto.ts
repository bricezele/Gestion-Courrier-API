/**
 * Project yoolearn-backend
 * File loginDto
 * Path src/api/users/dto
 * Created by BRICE ZELE
 * Date: 09/08/2021
 */
import {IsEmail, IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email de connexion',
        default: 'bricezele1@gmail.com',
        nullable: true,
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'Mot de passe de connexion',
        default: '1998@Arachides1998',
        nullable: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    readonly password: string;
}
