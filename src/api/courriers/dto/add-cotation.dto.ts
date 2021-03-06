/**
 * @Project gestion-courrier-api
 * @File add-cotation.dto.ts
 * @Path src/api/courriers/dto
 * @Author BRICE ZELE
 * @Date 22/04/2022
 */
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "../../users/entities/user.entity";
import { AddCotationEmployeDto } from "./add-cotation-employe.dto";

export class AddCotationDto {
    @ApiProperty({
        description: 'Statut de la cotation',
        nullable: false,
        default: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    readonly validate: boolean;

    @ApiProperty({
        description: 'Utilisateur',
        required: true,
    })
    @IsMongoId()
    @IsOptional()
    user: User;

    @ApiProperty({
        description: 'Cotation employe',
        required: false,
        default: [],
    })
    @IsArray()
    @IsOptional()
    cotation_employe?: AddCotationEmployeDto;

    @Exclude()
    readonly date: any;
}
