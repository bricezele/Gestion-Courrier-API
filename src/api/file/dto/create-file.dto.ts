import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { FileUsage } from "../../../enum/fileusage.enum";
import { FileType } from "../../../enum/filetype.enum";

export class CreateFileDto {
    @ApiProperty({
        description: "File Name",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    fileName?: string;

    @ApiProperty({
        description: "File usage",
        nullable: true
    })
    @IsEnum(FileUsage)
    type: FileUsage;

    @ApiProperty({
        description: "Type of file",
        nullable: true
    })
    @IsEnum(FileType)
    fileType: FileType;

    @ApiProperty({
        description: "URL image"
    })
    @IsUrl()
    url: string;

    /*    @ApiProperty({
            description: "Id de l'utilisateur",
            required: false,
        })
        @IsMongoId()
        @IsOptional()
        user?: string;*/
}
