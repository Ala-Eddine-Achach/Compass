import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fantasy } from './entities/fantasy.entity';
import {FantasyController} from "./controllers/fantasy.controller";
import {FantasyService} from "./services/fantasy.service";


@Module({
    imports: [TypeOrmModule.forFeature([Fantasy])],
    controllers: [FantasyController],
    providers: [FantasyService],
})
export class FantasyModule {}