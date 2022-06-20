import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateCourrierDto } from "./dto/create-courrier.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Model } from "mongoose";
import { I18nService } from "nestjs-i18n";
import { ObjectId } from "mongodb";
import { Courrier, CourrierDocument } from "./entities/courrier.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class CourriersService {
    constructor(
        @InjectModel(Courrier.name)
        private readonly courrierModel: Model<CourrierDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        private readonly i18n: I18nService,
    ) {}

    async create(createCourrierDto: CreateCourrierDto, user) {
        try {
            const createdCourrier = new this.courrierModel(createCourrierDto);
            await createdCourrier
                .populate({
                    path: 'cotation',
                    populate: [
                        {
                            path: 'user',
                            model: 'User',
                        },
                        {
                            path: 'cotation_employe.user',
                            model: 'User',
                        },
                    ],
                })
                .populate('documents_annexe')
                .populate({
                    path: 'modifications_history',
                    populate: {
                        path: 'user',
                        model: 'User',
                    },
                })
                .execPopulate();

            const courrier: Courrier = await createdCourrier.save();

            /*
console.log('Courrier', courrier);
courrier = await this.courrierModel
.findOneAndUpdate(
  {_id: courrier._id},
  {
      $push: {
          modifications_history:
              createCourrierDto.modifications_history,
      },
  },
)
.setOptions({overwrite: true, new: true})
.exec();
*/

            return courrier;
        } catch (error) {
            console.log('Error', error);
            if (error.hasOwnProperty('status'))
                throw new HttpException(error.message, error.status);
            else throw new InternalServerErrorException();
        }
    }

    async findAll(): Promise<Courrier[]> {
        try {
            return await this.courrierModel
                .find()
                .populate({
                    path: 'modifications_history',
                    populate: {
                        path: 'user',
                        model: 'User',
                    },
                })
                .populate({
                    path: 'cotation',
                    populate: [
                        {
                            path: 'user',
                            model: 'User',
                        },
                        {
                            path: 'cotation_employe.user',
                            model: 'User',
                        },
                    ],
                })
                .populate('documents_annexe')
                .sort({createdAt: 'desc'})
                .exec();
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: string): Promise<Courrier> {
        let courrier = null;
        try {
            courrier =
                ObjectId.isValid(id) &&
                (await this.courrierModel
                    .findOne({_id: mongoose.Types.ObjectId(id)})
                    .populate({
                        path: 'cotation',
                        populate: [
                            {
                                path: 'user',
                                model: 'User',
                            },
                            {
                                path: 'cotation_employe.user',
                                model: 'User',
                            },
                        ],
                    })
                    .populate('documents_annexe')
                    .populate({
                        path: 'modifications_history',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    })
                    .exec());
            if (!courrier) {
                const message = await this.i18n.translate(
                    'exceptions.WORKSHOP_NOT_FOUND',
                );
                throw new NotFoundException(message);
            } else return courrier;
        } catch (error) {
            console.log('Error', error);
            if (error.hasOwnProperty('status'))
                throw new HttpException(error.message, error.status);
            else throw new InternalServerErrorException();
        }
    }

    async update(id: string, updateCourrierDto, user?): Promise<Courrier> {
        try {
            updateCourrierDto.updatedAt = new Date();
            const courrierTemp: Courrier = await this.courrierModel
                .findOne({_id: id})
                .exec();

            console.log("updateCourrierDTO", JSON.stringify(updateCourrierDto));

            if (courrierTemp.status !== updateCourrierDto.status) {
                ObjectId.isValid(id) &&
                    (await this.courrierModel
                        .findByIdAndUpdate(
                            {_id: mongoose.Types.ObjectId(id)},
                            {
                                $push: {
                                    modifications_history: {
                                        status: updateCourrierDto.status,
                                        user: user._id,
                                    },
                                },
                            },
                            {upsert: true},
                        )
                        .populate({
                            path: 'cotation',
                            populate: [
                                {
                                    path: 'user',
                                    model: 'User',
                                },
                                {
                                    path: 'cotation_employe.user',
                                    model: 'User',
                                },
                            ],
                        })
                        .populate('documents_annexe')
                        .populate({
                            path: 'modifications_history',
                            populate: {
                                path: 'user',
                                model: 'User',
                            },
                        })
                        .exec());
            }
            const courrier =
                ObjectId.isValid(id) &&
                (await this.courrierModel
                    .findByIdAndUpdate(
                        {_id: mongoose.Types.ObjectId(id)},
                        updateCourrierDto,
                        {upsert: true},
                    )
                    .populate({
                        path: 'cotation',
                        populate: [
                            {
                                path: 'user',
                                model: 'User',
                            },
                            {
                                path: 'cotation_employe.user',
                                model: 'User',
                            },
                        ],
                    })
                    .populate('documents_annexe')
                    .populate({
                        path: 'modifications_history',
                        populate: {
                            path: 'user',
                            model: 'User',
                        },
                    })
                    .exec());

            if (!courrier) {
                const message = await this.i18n.translate(
                    'exceptions.WORKSHOP_NOT_FOUND',
                );
                throw new NotFoundException(message);
            } else return courrier;
        } catch (error) {
            console.log('Error', error);
            throw new InternalServerErrorException();
        }
    }

    remove(id: string) {
        return `This action removes a #${id} courrier`;
    }
}
