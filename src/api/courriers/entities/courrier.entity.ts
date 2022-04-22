import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Document, ObjectId, Types } from "mongoose";
import { CourrierType } from "../../../enum/courriertype.enum";
import { CourrierCategory } from "../../../enum/courriercategory.enum";
import { Direction } from "../../../enum/direction.enum";
import { User } from "../../users/entities/user.entity";
import { File } from "../../file/entities/file.entity";
import { CourrierStatus } from "../../../enum/courrierstatus.enum";

export type CourrierDocument = Courrier & Document;

@Schema()
export class HistoryModification {
    @Prop({
        type: String,
        enum: [
            CourrierStatus.PENDING,
            CourrierStatus.EN_ATTENTE_VALIDATION_1,
            CourrierStatus.EN_ATTENTE_VALIDATION_2,
            CourrierStatus.EN_ATTENTE_COTATION_APPROBATION_DGA,
            CourrierStatus.VALIDE_APPROUVE
        ],
        default: CourrierStatus.PENDING,
        required: true
    })
    status: string;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    @Type(() => User)
    user: User | Types.ObjectId;

    @Prop({ type: Date, required: false, default: Date.now })
    date: Date;
}

const HistoryModificationSchema =
  SchemaFactory.createForClass(HistoryModification);

@Schema()
export class Cotation {
    @Prop({ type: Boolean, required: true })
    validated: boolean;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    @Type(() => User)
    user: User | Types.ObjectId;

    @Prop({ type: Date, required: false, default: Date.now })
    date: Date;
}

const CotationSchema = SchemaFactory.createForClass(Cotation);

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    }
})
export class Courrier {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({
        type: String,
        required: false,
        default: null
    })
    objet: string;

    @Prop({ type: String, default: null, required: false, maxlength: 255 })
    picture: string;

    @Prop({ type: String, default: null, required: true, maxlength: 255 })
    code: string;

    @Prop({ type: String, default: null, required: true, maxlength: 255 })
    emetteur: string;

    @Prop({ type: String, default: null, required: false, maxlength: 255 })
    recepteur: string;

    @Prop({
        type: String,
        enum: [CourrierType.SORTANT, CourrierType.ENTRANT],
        default: CourrierType.ENTRANT
    })
    type: string;

    @Prop({
        type: String,
        enum: [Direction.FGT, Direction.DF, Direction.NMR, Direction.LG],
        default: Direction.FGT
    })
    direction: string;

    @Prop({
        type: String,
        enum: [
            CourrierStatus.PENDING,
            CourrierStatus.EN_ATTENTE_VALIDATION_1,
            CourrierStatus.EN_ATTENTE_VALIDATION_2,
            CourrierStatus.EN_ATTENTE_COTATION_APPROBATION_DGA,
            CourrierStatus.VALIDE_APPROUVE
        ],
        default: CourrierStatus.PENDING
    })
    status: string;

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
            CourrierCategory.DEMANDE_LOCATION_MATERIEL
        ],
        default: CourrierCategory.COURRIER
    })
    category: string;

    @Prop({ type: [CotationSchema], default: [] })
    cotation: Cotation[];

    @Prop({ type: [{ type: Types.ObjectId, ref: "File" }], default: null })
    @Type(() => File)
    documents_annexe: File[];

    @Prop({ type: [HistoryModificationSchema], default: [] })
    modifications_history: HistoryModification[];

    @Prop({ required: true, type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ required: true, type: Date, default: Date.now })
    updatedAt: Date;

    @Prop()
    deletedAt?: Date;
}

const CourrierSchema = SchemaFactory.createForClass(Courrier);
export {CourrierSchema};
