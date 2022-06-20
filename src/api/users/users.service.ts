import {
    ConflictException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as mongoose from "mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { I18nService } from "nestjs-i18n";
import { User, UserDocument } from "./entities/user.entity";
import { Request } from "express";
import { Role } from "../../enum/role.enum";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        private readonly i18n: I18nService,
    ) {}

    async create(req: Request, createUserDto: CreateUserDto): Promise<User> {
        let user = null;
        try {
            createUserDto.salt = await bcrypt.genSalt();
            createUserDto.password = await this.hashPassword(
                createUserDto.password,
                createUserDto.salt,
            );
            user = await this.userModel
                .findOne({email: createUserDto.email})
                .exec();

            if (user) {
                let errorMessage = '';
                if (user.email === createUserDto.email) {
                    errorMessage = await this.i18n.translate(
                        'exceptions.USER_ALREADY_EXISTS_EMAIL',
                        {args: {email: user.email}},
                    );
                }
                throw new ConflictException(errorMessage);
            } else {
                const createdUser = new this.userModel(createUserDto);
                if (createUserDto.department !== null) {
                    await createdUser.populate('department');
                }
                return createdUser.save();
            }
        } catch (error) {
            console.log('Error', error);
            if (error.hasOwnProperty('status'))
                throw new HttpException(error.message, error.status);
            else throw new InternalServerErrorException();
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel
                .find({roles: {$ne: Role.ADMIN}})
                .populate('department')
                .sort({_id: 1})
                .exec();
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: string): Promise<User> {
        let user = null;
        try {
            user =
                ObjectId.isValid(id) &&
                (await this.userModel
                    .findOne({_id: new mongoose.Types.ObjectId(id)})
                    .populate('department')
                    .exec());
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }

        if (!user) {
            const message = await this.i18n.translate(
                'exceptions.USER_NOT_FOUND',
            );
            throw new NotFoundException(message);
        } else return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        let user = null;
        try {
            user = await this.userModel
                .findOne({email})
                .populate('department')
                .exec();
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }

        if (!user) {
            const message = await this.i18n.translate(
                'exceptions.USER_NOT_FOUND',
                {
                    args: {email},
                },
            );
            throw new NotFoundException(message);
        } else return user;
    }

    async checkIfUserExistsByMail(email: string): Promise<User> {
        let user = null;
        try {
            user = await this.userModel.findOne({email}).exec();
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }
        return user;
    }

    async checkIfUserAdminExist(): Promise<Record<string, any>> {
        let count = null;
        try {
            count = await this.userModel.count().exec();
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }
        return {
            count,
        };
    }

    async update(id: string, updateUserDto) {
        let user = null;
        try {
            if (updateUserDto.password !== '') {
                updateUserDto.password = await this.hashPassword(
                    updateUserDto.password,
                    updateUserDto.salt,
                );
            }

            user =
                ObjectId.isValid(id) &&
                (await this.userModel
                    .findByIdAndUpdate({_id: id}, {$set: updateUserDto})
                    .setOptions({overwrite: true, new: true})
                    .populate('department')

                    .exec());
            if (!user) {
                const message = await this.i18n.translate(
                    'exceptions.USER_NOT_FOUND',
                );
                throw new NotFoundException(message);
            } else return user;
        } catch (error) {
            console.log('Error', error);
            if (error.hasOwnProperty('status'))
                throw new HttpException(error.message, error.status);
            throw new InternalServerErrorException();
        }
    }

    async remove(id: string) {
        let deletedUser = null;
        try {
            deletedUser = await this.userModel.findByIdAndDelete(id).exec();

            if (!deletedUser) {
                const message = await this.i18n.translate(
                    'exceptions.USER_NOT_FOUND',
                );
                throw new NotFoundException(message);
            } else {
                return deletedUser;
            }
        } catch (error) {
            console.log('Error', error);
            if (error.hasOwnProperty('status'))
                throw new HttpException(error.message, error.status);
            throw new InternalServerErrorException();
        }
    }

    private async hashPassword(
        password: string,
        salt: string,
    ): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
