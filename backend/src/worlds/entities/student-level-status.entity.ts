import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Level } from './level.entity';
import {Student} from "../../user/entities/student.entity";

@Entity()
export class StudentLevelStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string; // 'locked' or 'unlocked'

    @Column()
    pointsEarned: number;

    @ManyToOne(() => Student, student => student.levelStatuses)
    student: Student;

    @ManyToOne(() => Level, level => level.studentStatuses)
    level: Level;
}