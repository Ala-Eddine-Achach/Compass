import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import {FantasyService} from "../services/fantasy.service";
import {CreateFantasyDto} from "../dto/create-fantasy.dto";
import {UpdateFantasyDto} from "../dto/update-fantasy.dto";

@Controller('fantasy')
export class FantasyController {
    constructor(private readonly fantasyService: FantasyService) {}

    @Post()
    create(@Body() createFantasyDto: CreateFantasyDto) {
        return this.fantasyService.create(createFantasyDto);
    }

    @Get()
    findAll() {
        return this.fantasyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fantasyService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateFantasyDto: UpdateFantasyDto) {
        return this.fantasyService.update(+id, updateFantasyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fantasyService.remove(+id);
    }
}