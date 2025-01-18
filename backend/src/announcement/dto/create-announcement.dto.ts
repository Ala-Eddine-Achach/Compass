import { IsNotEmpty } from 'class-validator';
import { SubjectEntity } from 'src/subject/entities/subject.entity';
import { Teacher } from 'src/user/entities/teacher.entity';
import { ApiProperty } from "@nestjs/swagger";
//sawger to documentation
export class CreateAnnouncementDto {
  @ApiProperty({ description: 'The title of the announcement' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The subject of the announcement' })
  @IsNotEmpty()
  subject: SubjectEntity;

  @ApiProperty({ description: 'The teacher who made the announcement' })
  @IsNotEmpty()
  teacher: Teacher;
}
