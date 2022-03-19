import {
    IsEmail,
    IsEnum,
    IsNotEmpty, IsNumber,
    IsOptional,
    IsString,
    MaxLength
} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';
import {Role} from '../../../enum/role.enum';
import {Exclude} from 'class-transformer';
import {FakeData} from '../../../utils/FakeData';

export class CreateUserDto {
    @ApiProperty({
        description: "Nom de l'utilisateur",
        nullable: false,
        required: true,
        default: FakeData.user.firstname,
    })
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;

    @ApiProperty({
        description: "Prénom de l'utilisateur",
        default: FakeData.user.lastname,
    })
    @IsString()
    @IsOptional()
    readonly lastname?: string;

    @ApiProperty({
        description: "Email de l'utilisateur",
        nullable: false,
        required: true,
        default: FakeData.user.email,
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;


    @ApiProperty({
        description: "Avatar de l'utilisateur",
    })
    @IsNumber()
    @IsOptional()
    readonly picture: number;

    @ApiProperty({
        description: 'Numéro de téléphone',
        nullable: false,
        required: true,
        default: FakeData.user.phone_number,
    })
    @IsString()
    @IsNotEmpty()
    readonly phone_number: string;

    @Exclude()
    @IsOptional()
    salt: string;

    @ApiProperty({
        description: 'Mot de passe de connexion',
        nullable: false,
        required: true,
        default: FakeData.user.password,
    })
    @IsString()
    @MaxLength(255)
    password: string;

    @ApiProperty({
        description: "OS de l'utilisateur",
        nullable: true,
        default: Role.EDITOR,
    })
    @IsEnum(Role)
    @IsOptional()
    readonly roles: Role;

    @Exclude()
    readonly _id: string;

    @Exclude()
    readonly updatedAt: any;

    @Exclude()
    readonly createdAt: any;

    @Exclude()
    readonly lastVisit: any;

    @Exclude()
    readonly __v: string;
}
