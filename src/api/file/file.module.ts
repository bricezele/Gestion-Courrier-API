import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { OauthModule } from "../oauth/oauth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { File, FileSchema } from "./entities/file.entity";
import { UsersModule } from "../users/users.module";
import { CourriersModule } from "../courriers/courriers.module";

@Module({
    imports: [
        OauthModule,
        UsersModule,
        CourriersModule,
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule {
}
