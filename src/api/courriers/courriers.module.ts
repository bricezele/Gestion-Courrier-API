import { Module } from "@nestjs/common";
import { CourriersService } from "./courriers.service";
import { CourriersController } from "./courriers.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Courrier, CourrierSchema } from "./entities/courrier.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Courrier.name, schema: CourrierSchema }
        ])
    ],
    controllers: [CourriersController],
    providers: [CourriersService],
    exports: [CourriersService]
})
export class CourriersModule {}
