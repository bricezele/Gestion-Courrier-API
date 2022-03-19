import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourriersService } from './courriers.service';
import { CreateCourrierDto } from './dto/create-courrier.dto';
import { UpdateCourrierDto } from './dto/update-courrier.dto';

@Controller('courriers')
export class CourriersController {
  constructor(private readonly courriersService: CourriersService) {}

  @Post()
  create(@Body() createCourrierDto: CreateCourrierDto) {
    return this.courriersService.create(createCourrierDto);
  }

  @Get()
  findAll() {
    return this.courriersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courriersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourrierDto: UpdateCourrierDto) {
    return this.courriersService.update(+id, updateCourrierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courriersService.remove(+id);
  }
}
