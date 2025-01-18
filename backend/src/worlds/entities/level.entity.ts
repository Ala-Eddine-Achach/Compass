import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { World } from './world.entity';
import { Quiz } from './quiz.entity';
import { StudentLevelStatus } from './student-level-status.entity';

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    minPointsRequired: number;

    @ManyToOne(() => World, world => world.levels)
    world: World;

    @OneToMany(() => Quiz, quiz => quiz.level)
    quizzes: Quiz[];

    @OneToMany(() => StudentLevelStatus, status => status.level)
    studentStatuses: StudentLevelStatus[];
}