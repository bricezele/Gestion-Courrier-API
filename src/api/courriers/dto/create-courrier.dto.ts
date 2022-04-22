import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Direction } from "../../../enum/direction.enum";
import { CourrierStatus } from "../../../enum/courrierstatus.enum";
import { CourrierCategory } from "../../../enum/courriercategory.enum";
import { ObjectId } from "mongodb";
import { CourrierType } from "../../../enum/courriertype.enum";
import { AddHistoryDto } from "./add-history.dto";
import { AddCotationDto } from "./add-cotation.dto";

export class CreateCourrierDto {
    @ApiProperty({
        description: 'Demande de partenariat',
        required: true,
        nullable: false,
    })
    @IsString()
    readonly objet: string;

    @ApiProperty({
        description: "Nom de l'utilisateur",
        nullable: true,
        required: false,
        default: null,
    })
    @IsOptional()
    @IsString()
    readonly picture?: string;

    @ApiProperty({
        description: 'Port autonome de Douala',
        required: true,
        nullable: false,
    })
    @IsString()
    readonly emetteur: string;

    @ApiProperty({
        description: 'Code du courrier',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsOptional()
    code: string;

    @ApiProperty({
        description: 'Fast General Trading',
        required: true,
        nullable: false,
    })
    @IsString()
    readonly recepteur: string;

    @ApiProperty({
        description: 'Département récepteur du courrier',
        nullable: false,
        required: true,
        default: Direction.FGT,
    })
    @IsEnum(Direction)
    @IsNotEmpty()
    readonly direction?: Direction;

    @ApiProperty({
        description: 'Statut du courrier',
        nullable: false,
        default: CourrierStatus.PENDING,
    })
    @IsEnum(CourrierStatus)
    @IsNotEmpty()
    readonly status: CourrierStatus;

    @ApiProperty({
        description: 'Type du courrier',
        nullable: false,
        default: CourrierType.ENTRANT,
    })
    @IsEnum(CourrierType)
    @IsNotEmpty()
    readonly type: CourrierType;

    @ApiProperty({
        description: 'Catégorie du courrier',
        nullable: false,
        default: CourrierCategory.COURRIER,
    })
    @IsEnum(CourrierCategory)
    @IsNotEmpty()
    readonly category: CourrierCategory;

    @ApiProperty({
        description: 'Cotation du courrier',
        required: false,
        default: [],
    })
    @IsArray()
    @IsOptional()
    cotation?: AddCotationDto;

    @ApiProperty({
        description: 'Historique du courrier',
        required: false,
        default: [],
    })
    @IsObject()
    @IsOptional()
    modifications_history?: AddHistoryDto;

    @ApiProperty({
        description: "Image de l'atelier",
        required: false,
        default: [],
    })
    @IsArray()
    @IsNotEmpty()
    documents_annexe?: Array<ObjectId>;

    @Exclude()
    readonly _id: string;

    @Exclude()
    readonly updatedAt: any;

    @Exclude()
    readonly createdAt: any;

    @Exclude()
    readonly __v: string;
}
