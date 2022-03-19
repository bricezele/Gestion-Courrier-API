import { Injectable } from '@nestjs/common';
import { CreateCourrierDto } from './dto/create-courrier.dto';
import { UpdateCourrierDto } from './dto/update-courrier.dto';

@Injectable()
export class CourriersService {
  create(createCourrierDto: CreateCourrierDto) {
    return 'This action adds a new courrier';
  }

  findAll() {
    return `This action returns all courriers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} courrier`;
  }

  update(id: number, updateCourrierDto: UpdateCourrierDto) {
    return `This action updates a #${id} courrier`;
  }

  remove(id: number) {
    return `This action removes a #${id} courrier`;
  }
}
