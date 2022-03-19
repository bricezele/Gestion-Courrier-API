import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe, VersioningType} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as fs from 'fs';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);
    const swaggerConfig = new DocumentBuilder()
        .setTitle('GESTION COURRIER REST API Gateway')
        .setDescription('Gestion Courrier REST API documentation')
        .setContact(
            'Gestion Courrier',
            'https://fastgeneraltrading.com',
            'contact@fastgeneraltrading.com',
        )
        .setVersion(`${process.env.API_VERSION}`)
        .addServer(`api/${process.env.API_VERSION}`)
        .addBasicAuth()
        .addBearerAuth()
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    fs.writeFileSync(
        `${process.cwd()}/swagger.json`,
        JSON.stringify(document, null, 2),
        {encoding: 'utf8'},
    );

    SwaggerModule.setup('', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app
        //.use(helmet())
        //.use(csurf())
        .use(compression())
        /*        .use(
                rateLimit({
                    windowMs: 15 * 60 * 1000, //15 minutes
                    max: 100, //Limit each IP To 100 request per windowMS
                }),
            )*/
        .useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: {enableImplicitConversion: true},
            }),
        )
        .enableVersioning({type: VersioningType.URI})
        .setGlobalPrefix(`api`)
        .enableCors({origin: '*'} as CorsOptions);
    await app.listen(process.env.API_PORT);

    logger.log('NEST STARTED');
}

bootstrap();
