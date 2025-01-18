import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
@ApiTags('Announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({ summary: 'Create a new announcement it needs a title, subject and teacher' })
  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return await this.announcementService.create(createAnnouncementDto);
  }
  @ApiOperation({ summary: 'Get all announcements' })
  @Get()
  async findAll() {
    return await this.announcementService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.announcementService.findOne(+id);
  }

  @Get('subject/:subjectId')
  async findBySubject(@Param('subjectId') subjectId: string) {
    return await this.announcementService.findBySubject(+subjectId);
  }

  @Get('subject/:subjectId/teacher/:teacherId')
  async findBySubjectAndTeacher(
    @Param('subjectId') subjectId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return await this.announcementService.findBySubjectAndTeacher(
      +subjectId,
      +teacherId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    return await this.announcementService.update(+id, updateAnnouncementDto);
  }

  @Delete(':id')
  async softRemove(@Param('id') id: string) {
    return await this.announcementService.softRemove(+id);
  }

  @Patch('recover/:id')
  async recover(@Param('id') id: string) {
    return await this.announcementService.recover(+id);
  }
}
