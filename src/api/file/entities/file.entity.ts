import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";
import { Transform } from "class-transformer";
import { FileUsage } from "../../../enum/fileusage.enum";
import { FileType } from "../../../enum/filetype.enum";

export type FileDocument = File & Document;

@Schema()
export class File {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({ required: true, unique: true, default: null })
    fileName: string;
    y;
    @Prop({ required: true, unique: true, default: null })
    url: string;

    @Prop({
        type: String,
        required: true,
        enum: [
            FileUsage.COURRIER_IMAGE,
            FileUsage.COURRIER_IMAGE_ANNEXE,
            FileUsage.COURRIER_VIDEO,
            FileUsage.COURRIER_DOCUMENT,
            FileUsage.OTHER
        ],
        default: null
    })
    type: string;

    @Prop({
        type: String,
        required: true,
        enum: [FileType.PHOTO, FileType.VIDEO, FileType.PDF, FileType.VIDEO],
        default: null
    })
    fileType: string;

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now })
    updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
