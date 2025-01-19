import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fantasy } from './entities/fantasy.entity';
import {FantasyController} from "./controllers/fantasy.controller";
import {FantasyService} from "./services/fantasy.service";
import {SubjectEntity} from "../subject/entities/subject.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Fantasy,SubjectEntity])],
    controllers: [FantasyController],
    providers: [FantasyService],
})
export class FantasyModule {}