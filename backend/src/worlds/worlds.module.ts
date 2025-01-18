import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { World } from './entities/world.entity';
import { Level } from './entities/level.entity';
import { Quiz } from './entities/quiz.entity';
import { StudentLevelStatus } from './entities/student-level-status.entity';
import { WorldService } from './services/world.service';
import { LevelService } from './services/level.service';
import { QuizService } from './services/quiz.service';
import { StudentLevelStatusService } from './services/student-level-status.service';
import { WorldController } from './controllers/world.controller';
import {LevelController} from "./controllers/level.controller";
import {QuizController} from "./controllers/quiz.controller";
import {StudentLevelStatusController} from "./controllers/student-level-status.controller";


@Module({
    imports: [TypeOrmModule.forFeature([World, Level, Quiz, StudentLevelStatus])],
    controllers: [WorldController, LevelController, QuizController, StudentLevelStatusController],
    providers: [WorldService, LevelService, QuizService, StudentLevelStatusService],
})
export class WorldsModule {}