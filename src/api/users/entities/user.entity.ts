import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Transform} from 'class-transformer';
import {Document, ObjectId} from 'mongoose';
import {Role} from '../../../enum/role.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
})
export class User {
    @Transform(({value}) => value.toString())
    _id: ObjectId;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    player_id: string;

    @Prop({
        required: true,
        unique: true,
        maxlength: 255,
        set: email => {
            return email.toLowerCase();
        },
        trim: true,
    })
    email: string;

    @Prop({type: Number, default: null})
    picture: number;

    @Prop({type: String, default: null, required: true, maxlength: 255})
    firstname: string;

    @Prop({type: String, default: null, required: false, maxlength: 255})
    lastname: string;

    @Prop({type: String, default: null, required: false, maxlength: 255})
    phone_number: string;

    @Prop({required: true, maxlength: 255})
    password: string;

    @Prop({maxlength: 255})
    salt: string;

    @Prop({
        type: String,
        enum: [Role.ADMIN, Role.STANDARD, Role.ASSISTANTE_DG, Role.EDITOR],
        default: Role.EDITOR,
    })
    roles: string;

    @Prop({required: true, type: Date, default: Date.now})
    createdAt: Date;

    @Prop({required: true, type: Date, default: Date.now})
    updatedAt: Date;

    @Prop()
    deletedAt?: Date;

    public async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}

const UserSchema = SchemaFactory.createForClass(User);
export {UserSchema};
