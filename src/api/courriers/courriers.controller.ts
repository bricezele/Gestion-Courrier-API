import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CourriersService } from "./courriers.service";
import { CreateCourrierDto } from "./dto/create-courrier.dto";
import { UpdateCourrierDto } from "./dto/update-courrier.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Courrier } from "./entities/courrier.entity";
import { GetUser } from "../../decorator/get-user.decorator";
import { User } from "../users/entities/user.entity";

@Controller({
    path: "courriers",
    version: "1"
})
@ApiBearerAuth()
@ApiTags("Courrier Endpoint")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourriersController {
    constructor(private readonly courriersService: CourriersService) {
    }

    @Post()
    @ApiBody({ type: CreateCourrierDto })
    @ApiOperation({
        operationId: "createCourrier",
        summary: "Creation d'un courrier",
        description: "Création d'un nouveau courrier"
    })
    @ApiCreatedResponse({
        description: "Succes création courrier",
        type: CreateCourrierDto
    })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiInternalServerErrorResponse({
        description: "Internal server error"
    })
    create(
      @Body() createCourrierDto: CreateCourrierDto,
      @GetUser() user: User
    ): Promise<Courrier> {
        return this.courriersService.create(createCourrierDto, user);
    }

    @Get()
    findAll() {
        return this.courriersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.courriersService.findOne(id);
    }

    @Put(":id")
    update(
      @Param("id") id: string,
      @Body() updateCourrierDto: UpdateCourrierDto,
      @GetUser() user: User
    ): Promise<Courrier> {
        return this.courriersService.update(id, updateCourrierDto, user);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.courriersService.remove(id);
    }
}
