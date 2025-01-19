import {IsInt, IsString, IsOptional, IsArray, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";

export class SubjectDto {
    @IsInt()
    id: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsInt()
    @IsOptional()
    score?: number;
}

export class UpdateFantasySubjectsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubjectDto)
    subjects: SubjectDto[];
}