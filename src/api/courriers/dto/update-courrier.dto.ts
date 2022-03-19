import { PartialType } from '@nestjs/swagger';
import { CreateCourrierDto } from './create-courrier.dto';

export class UpdateCourrierDto extends PartialType(CreateCourrierDto) {}
