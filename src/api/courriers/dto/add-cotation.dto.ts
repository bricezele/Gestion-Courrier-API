/**
 * @Project gestion-courrier-api
 * @File add-cotation.dto.ts
 * @Path src/api/courriers/dto
 * @Author BRICE ZELE
 * @Date 22/04/2022
 */
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { User } from "../../users/entities/user.entity";

export class AddCotationDto {
    @ApiProperty({
        description: "Statut de la cotation",
        nullable: false,
        default: false
    })
    @IsBoolean()
    @IsNotEmpty()
    readonly validate: boolean;

    @ApiProperty({
        description: "Utilisateur",
        required: true
    })
    @IsMongoId()
    @IsOptional()
    user: User;

    @Exclude()
    readonly date: any;
}
