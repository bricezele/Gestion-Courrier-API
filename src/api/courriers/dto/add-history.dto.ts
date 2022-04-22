/**
 * Project gestion-courrier-api
 * File add-history.dto
 * Path src/api/courriers/dto
 * Created by BRICE ZELE
 * Date: 24/03/2022
 */
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CourrierStatus } from "../../../enum/courrierstatus.enum";
import { Exclude } from "class-transformer";
import { User } from "../../users/entities/user.entity";

export class AddHistoryDto {
    @ApiProperty({
        description: "Statut du courrier",
        nullable: false,
        default: CourrierStatus.PENDING
    })
    @IsEnum(CourrierStatus)
    @IsNotEmpty()
    readonly status: CourrierStatus;

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
