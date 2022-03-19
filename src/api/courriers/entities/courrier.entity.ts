import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Transform, Type} from 'class-transformer';
import {Document, ObjectId, Types} from 'mongoose';
import {CourrierType} from '../../../enum/courriertype.enum';
import {CourrierCategory} from '../../../enum/courriercategory.enum';
import {Direction} from '../../../enum/direction.enum';
import {User} from '../../users/entities/user.entity';

export type CourrierDocument = Courrier & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
})
export class Courrier {
    @Transform(({value}) => value.toString())
    _id: ObjectId;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    objet: string;

    @Prop({type: Number, default: null})
    picture: number;

    @Prop({type: String, default: null, required: true, maxlength: 255})
    code: string;

    @Prop({type: String, default: null, required: true, maxlength: 255})
    emetteur: string;

    @Prop({type: String, default: null, required: true, maxlength: 255})
    recepteur: string;

    @Prop({
        type: String,
        enum: [CourrierType.SORTANT, CourrierType.ENTRANT],
        default: CourrierType.ENTRANT,
    })
    type: string;

    @Prop({
        type: String,
        enum: [
            Direction.ADMINISTRATIF,
            Direction.FINANCIER,
            Direction.TECHNIQUE,
        ],
        default: Direction.ADMINISTRATIF,
    })
    direction: string;

    @Prop({
        type: String,
        enum: [
            CourrierCategory.ARRETE,
            CourrierCategory.COMPTE_RENDU,
            CourrierCategory.COURRIER,
            CourrierCategory.DEPOT_PLAINTE,
            CourrierCategory.FACTURE,
            CourrierCategory.FAX,
            CourrierCategory.FICHE_SIGNALEMENT,
            CourrierCategory.INTERVENTION,
            CourrierCategory.MAIL,
            CourrierCategory.NOTE,
            CourrierCategory.RAPPORT,
            CourrierCategory.SOMMATION,
            CourrierCategory.BON_COMMANDE,
            CourrierCategory.DEVIS,
            CourrierCategory.DEMANDE_PARTENARIAT,
            CourrierCategory.REJET_PARTENARIAT,
            CourrierCategory.ACCORD_PARTENARIAT,
            CourrierCategory.DEMANDE_CONGE,
            CourrierCategory.DEMANDE_EXPLICATION,
            CourrierCategory.DEMANDE_PERMISSION,
            CourrierCategory.DEMANDE_LOCATION_MATERIEL,
        ],
        default: CourrierCategory.COURRIER,
    })
    category: string;

    @Prop({type: [{type: Types.ObjectId, ref: 'User'}], default: null})
    @Type(() => User)
    cotation: User[];

    @Prop({required: true, type: Date, default: Date.now})
    createdAt: Date;

    @Prop({required: true, type: Date, default: Date.now})
    updatedAt: Date;

    @Prop()
    deletedAt?: Date;
}

const CourrierSchema = SchemaFactory.createForClass(Courrier);
export {CourrierSchema};
