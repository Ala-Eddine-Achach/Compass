import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Level } from './level.entity';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @Column('json')
    options: string[];

    @Column()
    correctAnswer: string;

    @ManyToOne(() => Level, level => level.quizzes)
    level: Level;
}