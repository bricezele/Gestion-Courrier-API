/**
 * Project yoolearn-backend
 * File AbstractEntity
 * Path src/entities
 * Created by BRICE ZELE
 * Date: 22/08/2021
 */
import {
    CreateDateColumn,
    DeepPartial,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import {Exclude} from 'class-transformer';
import {ApiHideProperty} from '@nestjs/swagger';


export abstract class AbstractEntity {
    public constructor(input?: DeepPartial<AbstractEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
    })
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    @ApiHideProperty()
    deletedAt: Date;
}
