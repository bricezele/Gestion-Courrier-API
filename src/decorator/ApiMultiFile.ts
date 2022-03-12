/**
 * Project yoolearn-backend
 * File ApiMultiFile
 * Path src/decorator
 * Created by BRICE ZELE
 * Date: 21/10/2021
 */
import {ApiBody} from '@nestjs/swagger';

export const ApiMultiFile =
    (fileName = 'file'): MethodDecorator =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        ApiBody({
            type: 'multipart/form-data',
            required: true,
            schema: {
                type: 'object',
                properties: {
                    [fileName]: {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            },
        })(target, propertyKey, descriptor);
    };
