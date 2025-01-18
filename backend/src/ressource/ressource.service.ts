import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RessourceEntity } from './entities/ressource.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRoleEnum } from 'src/Enums/user-role.enum';
import { SessionTypeService } from 'src/session-type/session-type.service';
import { NotifTypeEnum } from '../Enums/notif-type.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewNotificationService } from '../new-notification/new-notification.service';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class RessourceService {
  constructor(
    @InjectRepository(RessourceEntity)
    private ressourceRepository: Repository<RessourceEntity>,
    private sessionTypeService: SessionTypeService,
    private eventEmitter: EventEmitter2,
    private notificationService: NewNotificationService,
  ) {}

  async create(
    createRessourceDto: CreateRessourceDto,
    user: User,
    file: Express.Multer.File,
  ) {
    if (user.role != UserRoleEnum.TEACHER) {
      throw new HttpException('You are not a teacher', HttpStatus.FORBIDDEN);
    }

    const sessionType = await this.sessionTypeService.findBySession(
      createRessourceDto.session,
    );
    if (sessionType[0].teacher.id != user.id) {
      throw new HttpException(
        `You are not the teacher of this session: your id is ${user.id} and the owner's id is ${sessionType[0].teacher.id}`,
        HttpStatus.FORBIDDEN,
      );
    }

    // Upload file to local storage
    const fileUploadResponse = await this.uploadFile(file, 'resources');
    const notification = await this.notificationService.buildNotification(
      NotifTypeEnum.CONTENT,
      user?.username,
      null,
      createRessourceDto?.session,
      0,
      user?.photo,
      user?.id,
    );

    this.eventEmitter.emit('notify', notification);

    // Save the resource entity with the uploaded file URL
    createRessourceDto.fileUrl = fileUploadResponse.url;
    createRessourceDto.type = 'file';
    createRessourceDto.link = null;
    return await this.ressourceRepository.save(createRessourceDto);
  }

  async uploadFile(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<{ url: string }> {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      const filename = `${folderPath}/${uniqueSuffix}.${ext}`;
      const filePath = join(__dirname, '..', 'uploads', filename);

      // Ensure the directory exists
      const fs = require('fs');
      const dir = join(__dirname, '..', 'uploads', folderPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the file to the local filesystem
      const fileStream = createWriteStream(filePath);
      fileStream.write(file.buffer);
      fileStream.end();

      // Return the URL to access the file
      const fileUrl = `/uploads/${filename}`;
      return { url: fileUrl };
    } catch (error) {
      console.error('Error occurred during file upload:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async addLink(createRessourceDto: CreateRessourceDto, user: User) {
    if (user.role != UserRoleEnum.TEACHER) {
      throw new HttpException('You are not a teacher', HttpStatus.FORBIDDEN);
    }

    const sessionType = await this.sessionTypeService.findBySession(
      createRessourceDto.session,
    );
    if (sessionType[0].teacher.id != user.id) {
      throw new HttpException(
        `You are not the teacher of this session: your id is ${user.id} and the owner's id is ${sessionType[0].teacher.id}`,
        HttpStatus.FORBIDDEN,
      );
    }

    createRessourceDto.type = 'link';
    createRessourceDto.fileUrl = null;

    // Ensure `link` is set
    if (!createRessourceDto.link) {
      throw new HttpException('Link must be provided', HttpStatus.BAD_REQUEST);
    }

    const notification = await this.notificationService.buildNotification(
      NotifTypeEnum.CONTENT,
      user?.username,
      null,
      createRessourceDto?.session,
      0,
      user?.photo,
      user?.id,
    );

    this.eventEmitter.emit('notify', notification);
    const savedResource =
      await this.ressourceRepository.save(createRessourceDto);
    return savedResource;
  }

  async findAll() {
    return await this.ressourceRepository.find({
      relations: ['session'],
    });
  }

  async findBySession(sessionId: number) {
    return await this.ressourceRepository
      .createQueryBuilder('ressource')
      .where('ressource.session = :sessionId', { sessionId })
      .getMany();
  }

  async remove(id: number) {
    return await this.ressourceRepository.softRemove({ id });
  }

  async recover(id: number) {
    return await this.ressourceRepository.recover({ id });
  }
}