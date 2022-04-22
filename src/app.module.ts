import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./api/users/users.module";
import { OauthModule } from "./api/oauth/oauth.module";
import * as path from "path";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeormConfig } from "./config/typeorm.config";
import { ConfigModule } from "@nestjs/config";
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver
} from "nestjs-i18n";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./filters/http.exception.filter";
import { CourriersModule } from "./api/courriers/courriers.module";
import { FileModule } from "./api/file/file.module";
import { DepartmentModule } from "./api/department/department.module";

@Module({
  imports: [
    MulterModule.register({
      dest: "./upload"
    }),
    MongooseModule.forRoot(TypeormConfig.url),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env" : ".dev.env",
            isGlobal: true,
        }),
        OauthModule,
        UsersModule,
        I18nModule.forRoot({
            fallbackLanguage: 'fr',
            fallbacks: {
                'en-CA': 'fr',
                'en-*': 'en',
                'fr-*': 'fr',
            },
            parser: I18nJsonParser,
            parserOptions: {
                path: path.join(process.cwd(), '/dist/i18n/'),
                watch: true,
            },
            resolvers: [
                {use: QueryResolver, options: ['lang', 'locale', 'l']},
                new HeaderResolver(['x-custom-lang']),
                AcceptLanguageResolver,
                new CookieResolver(['lang', 'locale', 'l']),
            ],
        }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.EMAIL_HOST,
                    port: Number(process.env.EMAIL_PORT),
                    auth: {
                        user: process.env.EMAIL_AUTH_USER,
                        pass: process.env.EMAIL_AUTH_PASSWORD,
                    },
                },
                defaults: {
                    from: '"Yoolearn" <info@yoolearn.co>',
                },
                preview: false,
                template: {
                    dir: path.join(__dirname, 'templates'),
                  adapter: new HandlebarsAdapter(),
                  options: {
                    strict: true
                  }
                },
            }),
        }),
    UsersModule,
    OauthModule,
    CourriersModule,
    FileModule,
    DepartmentModule
  ],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    controllers: [AppController],
})
export class AppModule {}
