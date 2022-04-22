import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { Express, Request } from "express";
import { ObjectId } from "mongodb";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { FileUsage } from "../../enum/fileusage.enum";
import { File, FileDocument } from "./entities/file.entity";
import { I18nService } from "nestjs-i18n";
import { UsersService } from "../users/users.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { FileType } from "../../enum/filetype.enum";
import { CourriersService } from "../courriers/courriers.service";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

@Injectable()
export class FileService {
    constructor(
      @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
      private readonly i18n: I18nService,
      private readonly usersService: UsersService,
      private readonly courriersService: CourriersService
    ) {
    }

    async create(createFileDto: CreateFileDto): Promise<File> {
        try {
            const createdResourceFile = new this.fileModel(createFileDto);
            //await createdResourceFile.populate('user').execPopulate();
            return createdResourceFile.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: string): Promise<File> {
        let file = null;
        try {
            file =
              ObjectId.isValid(id) &&
              (await this.fileModel
                .findOne({ _id: new mongoose.Types.ObjectId(id) })
                .exec());
        } catch (error) {
            console.log("Error", error);
            throw new InternalServerErrorException();
        }
        if (!file) {
            const message = await this.i18n.translate(
              "exceptions.FILE_RESOURCE_NOT_FOUND"
            );
            throw new NotFoundException(message);
        } else return file;
    }

    async saveImage(req: Request, file: Express.Multer.File) {
        try {
            let resizeWidth = null;
            let compressionQuality = 100;
            let fileCreate = null;
            let pictureUrl: string;
            console.log("request path", req.path);
            if (process.env.NODE_ENV !== "production")
                pictureUrl = `${req.protocol}://${req.hostname}:${process.env.API_PORT}${req.path}`;
            else pictureUrl = `${req.protocol}://${req.hostname}${req.path}`;

            pictureUrl = pictureUrl.replace("/single-file", "");
            pictureUrl = pictureUrl.replace("/multiple-file", "");

            let createFileDto: CreateFileDto;
            switch (req.query.type) {
                case FileUsage.COURRIER_IMAGE:
                    resizeWidth = Number(
                      process.env.COURRIER_IMAGE_UPLOAD_SIZE
                    );
                    compressionQuality = Number(
                      process.env.COURRIER_IMAGE_UPLOAD_QUALITY
                    );
                    if (req.query.courrierId) {
                        pictureUrl += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}/${file.filename}`;
                        this.courriersService.update(
                          "" + req.query.courrierId,
                          {
                              $set: {
                                  picture: pictureUrl
                              }
                          }
                        );
                    }
                    break;

                case FileUsage.COURRIER_IMAGE_ANNEXE:
                    pictureUrl += `/${process.env.COURRIER_IMAGE_UPLOAD_FOLDER}/${file.filename}`;
                    //resizeWidth = Number(process.env.WORKSHOP_IMAGE_UPLOAD_FILE);
                    compressionQuality = Number(
                      process.env.COURRIER_IMAGE_UPLOAD_QUALITY
                    );
                    createFileDto = {
                        fileName: file.filename,
                        type: FileUsage.COURRIER_IMAGE_ANNEXE,
                        fileType: FileType.PHOTO,
                        url: pictureUrl
                    };
                    fileCreate = await this.create(createFileDto);
                    break;
            }
            //console.log(fileCreate);
            return fileCreate;
        } catch (error) {
            console.log("File service", error);
            if (error.hasOwnProperty("status"))
                throw new HttpException(error.message, error.status);
            else throw new InternalServerErrorException();
        }
    }
}
