import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Student} from "../../user/entities/student.entity";

@Entity()
export class Fantasy {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, student => student.fantasies)
    student: Student;

    @Column('json') // Use JSON to store the array
    subjectIds: number[];

    @Column()
    totalScore: number;

}