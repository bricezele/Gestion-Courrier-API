/**
 * Project yoolearn-backend
 * File http.exception.filter
 * Path src/filters
 * Created by BRICE ZELE
 * Date: 05/08/2021
 */
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {I18nService} from 'nestjs-i18n';
import {Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) {}

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        const statusCode = exception.getStatus();
        let message: string | Record<string, any> = null;
        const errorResponse = exception.getResponse();

        console.log('ctx.getRequest', ctx.getRequest());

        switch (statusCode) {
            case HttpStatus.UNAUTHORIZED:
                if (errorResponse.hasOwnProperty('error'))
                    message = errorResponse['message'];
                else
                    message = await this.i18n.translate(
                        'exceptions.UNAUTHORIZED',
                    );

                break;

            case HttpStatus.INTERNAL_SERVER_ERROR:
                message = await this.i18n.translate(
                    'exceptions.INTERNAL_SERVER_ERROR',
                );
                break;

            case HttpStatus.FORBIDDEN:
                message = await this.i18n.translate('exceptions.FORBIDDEN');
                break;

            default:
                message = exception.getResponse();
        }
        if (typeof message !== 'string') message = message['message'];

        const user = request.user;
        /*        this.client.instance().setTag('url', request.url);
        this.client.instance().setTag('body', JSON.stringify(request.body));
        this.client.instance().setTag('params', JSON.stringify(request.params));
        this.client.instance().setUser(user);
        this.client.instance().captureMessage('' + message, Severity.Log);
        this.client.instance().captureException(exception);*/

        response.status(statusCode).json({
            error: exception.name,
            timestamp: new Date(),
            status: statusCode,
            message,
            path: request.url,
            stack: exception.stack,
        });
    }
}
