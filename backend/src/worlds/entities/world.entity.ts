import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Level } from './level.entity';

@Entity()
export class World {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    subjectId: number;

    @OneToMany(() => Level, level => level.world)
    levels: Level[];
}