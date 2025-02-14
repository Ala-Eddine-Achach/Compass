import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommonChatSessionDto } from './dto/create-common-chat-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonChatEntity } from './entities/common-chat.entity';
import { Repository } from 'typeorm';
import { NewNotificationService } from '../new-notification/new-notification.service';
import { NotifTypeEnum } from '../Enums/notif-type.enum';
import { SessionEntity } from '../session/entities/session.entity';

@Injectable()
export class CommonChatSessionService {
  constructor(
    @InjectRepository(CommonChatEntity)
    private readonly commonChatSessionRepository: Repository<CommonChatEntity>,
    private notificationService: NewNotificationService,
  ) {}
  clientToUser: any = {};

  private organizeMessages(messages: any[]): any[] {
    const organizedMessages = [];
    const map = new Map();

    messages.forEach((message) => {
      map.set(message.id, {
        ...message,
        replies: [],
        author: {
          username: message.author.username,
          role: message.author.role,
          id: message.author.id,
          photo: message.author.photo,
        },
      });
    });

    messages.forEach((message) => {
      if (message.parent) {
        const parentMessage = map.get(message.parent.id);
        if (parentMessage) {
          parentMessage.replies.push(map.get(message.id));
        } else {
          organizedMessages.forEach((orgMessage) => {
            if (orgMessage.id === message.parent.id) {
              orgMessage.replies.push(map.get(message.id));
            }
          });
        }
      } else {
        organizedMessages.push(map.get(message.id));
      }
    });

    return organizedMessages;
  }
  private findMessageById(messages: any[], id: number): any | null {
    for (const message of messages) {
      if (message.id === id) {
        return message; // Found the message
      }
      if (message.replies && message.replies.length > 0) {
        const foundInReplies = this.findMessageById(message.replies, id);
        if (foundInReplies) {
          return foundInReplies; // Found the message in replies
        }
      }
    }
    return null;
  }
  async createMessage(createCommonChatSessionDto: CreateCommonChatSessionDto) {
    const notification = await this.notificationService.buildNotification(
      NotifTypeEnum.MESSAGE,
      createCommonChatSessionDto?.author?.username,
      null,
      createCommonChatSessionDto?.session?.id,
      0,
      createCommonChatSessionDto?.author?.photo,
      createCommonChatSessionDto?.author?.id,
    );
    //console.log('notification', notification);
    const newMessage = this.commonChatSessionRepository.create(
      createCommonChatSessionDto,
    );
    await this.commonChatSessionRepository.save(newMessage);
    return { notification: notification, message: newMessage };
  }
  async findAll(session: SessionEntity): Promise<any[]> {
    //console.log('sessionId', session);
    const chats = await this.commonChatSessionRepository.find({
      where: { session: { id: session?.id } },
      relations: ['parent', 'author', 'session'],
    });
    const chatsWithAuthorDetails = chats.map((chat) => {
      return {
        ...chat,
        session,
        author: {
          photo: chat.author.photo,
          username: chat.author.username,
          role: chat.author.role,
          id: chat.author.id,
        },
      };
    });
    //console.log('chatsWithAuthorDetails', chatsWithAuthorDetails);
    return this.organizeMessages(chatsWithAuthorDetails);
  }

  async deleteMessage(id: number, session: SessionEntity) {
    const messages = await this.findAll(session);
    const messageToDelete = this.findMessageById(messages, id);
    if (messageToDelete) {
      await this.commonChatSessionRepository.softRemove(messageToDelete);
    } else {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
  }
}
