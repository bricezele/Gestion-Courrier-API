import { Module } from '@nestjs/common';
import { CourriersService } from './courriers.service';
import { CourriersController } from './courriers.controller';

@Module({
  controllers: [CourriersController],
  providers: [CourriersService]
})
export class CourriersModule {}
