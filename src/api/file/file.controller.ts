import {
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import { FileService } from "./file.service";
import { CreateFileDto } from "./dto/create-file.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { join } from "path";
import { Role } from "../../enum/role.enum";
import { FileUsage } from "../../enum/fileusage.enum";
import { EntityType } from "../../enum/entitytype.enum";
import { FileType } from "../../enum/filetype.enum";
import { diskStorage } from "multer";
import * as Utils from "../../utils/";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { GetUser } from "../../decorator/get-user.decorator";
import { User } from "../users/entities/user.entity";

const _ = require("lodash");

@Controller({
    path: "files",
    version: "1"
})
@ApiBearerAuth()
@ApiTags("File Endpoint")
/*@UseGuards(JwtAuthGuard, RolesGuard)*/
/*@RolesDecorator(Role.ADMIN)*/
@Controller("file")
export class FileController {
    constructor(private readonly fileService: FileService) {
    }

    @Post("/single-file")
    @ApiQuery({ name: "role", enum: Role, required: true })
    @ApiQuery({ name: "type", enum: FileUsage, required: true })
    @ApiQuery({ name: "entity", enum: EntityType, required: true })
    @ApiQuery({ name: "filetype", enum: FileType, required: true })
    @ApiQuery({ name: "courrierId", type: String, required: false })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary"
                }
            }
        }
    })
    @ApiOperation({
        operationId: "uploadFile",
        summary: "Upload d'un fichier",
        description: "Upload d'un fichier sur le serveur"
    })
    @ApiCreatedResponse({
        description: "Succes upload fichier",
        type: CreateFileDto
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error"
    })
    @UseInterceptors(
      FileInterceptor("file", {
          storage: diskStorage({
              destination: Utils.uploadDestinationFolder,
              filename: Utils.uploadFileName
          }),
          limits: {
              files: 1,
              fileSize: Number(process.env.MAX_UPLOAD_FILE_SIZE) //100MB
          }
      })
    )
    async uploadedFile(
      @Req() req: Request,
      @Query("type") type: string,
      @Query("entity") entity: string,
      @Query("filetype") filetype: string,
      @Query("courrierId") courrierId: string,
      @GetUser() user: User,
      @UploadedFile() file: Express.Multer.File
    ) {
        console.log("File", file);
        await this.fileService.saveImage(req, file);
        return file;
    }

    @Post("/multiple-file")
    @ApiQuery({ name: "role", enum: Role, required: true })
    @ApiQuery({ name: "type", enum: FileUsage, required: true })
    @ApiQuery({ name: "entity", enum: EntityType, required: true })
    @ApiQuery({ name: "filetype", enum: FileType, required: true })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary"
                    }
                }
            }
        }
    })
    @ApiOperation({
        operationId: "uploadFile",
        summary: "Upload des fichiers",
        description: "Upload des fichiers sur le serveur"
    })
    @ApiCreatedResponse({
        description: "Succes upload fichier",
        type: CreateFileDto
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error"
    })
    @UseInterceptors(
      FilesInterceptor("files", 10, {
          storage: diskStorage({
              destination: Utils.uploadDestinationFolder,
              filename: Utils.uploadFileName
          }),
          limits: {
              files: 10,
              fileSize: Number(process.env.MAX_UPLOAD_FILE_SIZE) //100MB
          }
      })
    )
    async uploadedFiles(
      @Req() req: Request,
      @Query("type") type: string,
      @Query("filetype") filetype: string,
      @GetUser() user: User,
      @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log("files", files);
        if (!_.isNil(files)) {
            return await Promise.all(
              files.map(async file => {
                  return await this.fileService.saveImage(req, file);
              })
            );
        }
    }

    @Get(":resourcepath/:imagename")
    @ApiParam({
        name: "resourcepath",
        required: true,
        description: "resource path",
        schema: { oneOf: [{ type: "string" }] }
    })
    @ApiOperation({
        operationId: "getUploadFile",
        summary: "Recuperation des resources uploader",
        description: "Recuperation des ressources uploader"
    })
    @ApiCreatedResponse({
        description: "Succes recuperation de fichier"
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error"
    })
    seeUploadedFile(
      @Param("resourcepath") resourcepath,
      @Param("imagename") imagename,
      @Res() res
    ) {
        /*        console.log(
            'Path',
            join(process.cwd(), 'upload', resourcepath, imagename),
        );
        const file = createReadStream(
            join(process.cwd(), 'upload', resourcepath, imagename),
        );
        file.pipe(res);*/
        //return res.download(join(process.cwd(), 'upload', resourcepath, imagename));
        return res.sendFile(
          join(process.cwd(), "upload", resourcepath, imagename)
        );
    }
}
