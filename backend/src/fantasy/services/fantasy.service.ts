import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Fantasy} from "../entities/fantasy.entity";
import {Subject} from "rxjs";
import {Repository} from "typeorm";
import {SubjectDto, UpdateFantasySubjectsDto} from "../dto/subjects.dto";
import {SubjectEntity} from "../../subject/entities/subject.entity";
import {Student} from "../../user/entities/student.entity";

@Injectable()
export class FantasyService {
    constructor(
        @InjectRepository(Fantasy)
        private readonly fantasyRepository: Repository<Fantasy>,
        @InjectRepository(SubjectEntity)
        private readonly subjectRepository: Repository<SubjectEntity>,
    ) {}

    async updateSubjects(
        updateDto: UpdateFantasySubjectsDto, // Use UpdateFantasySubjectsDto instead of SubjectDto[]
        user: Student,
    ): Promise<Fantasy> {
        // Find the fantasy associated with the current student
        const fantasy = await this.fantasyRepository.findOne({
            where: { student: { id: user.id } }, // Use user.id to find the fantasy
        });

        if (!fantasy) {
            console.log('fantasy not found');
            // Create a new fantasy object if it doesn't exist
            const newFantasy = new Fantasy();
            newFantasy.student = user;
            newFantasy.subjectIds = updateDto.subjects.map(subject => subject.id);
            return this.fantasyRepository.save(newFantasy);
        }

        // Update the subjectIds and totalScore based on the incoming DTO
        fantasy.subjectIds = updateDto.subjects.map(subject => subject.id);
        console.log('fantasy', fantasy);
        return this.fantasyRepository.save(fantasy);
    }

    async getSubjects(user:Student): Promise<SubjectDto[]> {
        const fantasy = await this.fantasyRepository.findOne({
            where: { student: { id: user.id } }, // Use user.id to find the fantasy
        });

        if (!fantasy) {
            console.log('fantasy not found');
            const newFantasy = new Fantasy();
            newFantasy.student = user;
            newFantasy.totalScore = 0;
            newFantasy.subjectIds = [];
            await this.fantasyRepository.save(newFantasy);
            return [
                {
                    id: -1,
                    name: '',
                    score: 0,
                },
                {
                    id: -1,
                    name: '',
                    score:0 ,
                },
                {
                    id: -1,
                    name: '',
                    score: 0,
                },
                {
                    id: -1,
                    name: '',
                    score: 0,
                },
                {
                    id: -1,
                    name: '',
                    score: 0,
                }
            ];
        }
        console.log('fantasy found in getSubjects', fantasy);
        // Fetch the actual subjects based on subjectIds
        var subjects=[];
        if (fantasy.subjectIds.length > 0) {
            subjects = await this.subjectRepository.findByIds(fantasy.subjectIds);
        }

        var  result = subjects.map(subject => {
            return {
                id: subject.id,
                name: subject.name,
                score: 50,
            };
        });
        //add empty subjects if less than 5
        for (let i = result.length; i < 5; i++) {
            result.push({
                id: -1,
                name: '',
                score: 0,
            });
        }
        return result;
    }

    async findAllSubjects() {
        var result = await this.subjectRepository.find();
        //delete non needed fields
        //let just id and name
        var res = result.map(subject => {
            return {
                id: subject.id,
                name: subject.name,
            };
        });
        return res;
    }
}