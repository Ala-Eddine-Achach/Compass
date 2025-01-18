import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { ChatbotMessagesEntity } from './chatbot-messages.entity';
import { Student } from '../../user/entities/student.entity';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity('chatbot_discussions')
export class ChatbotDiscussionsEntity extends TimestampEntites {
  @ApiProperty({ description: 'The id of the chatbot discussion' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The student who made the discussion' })
  @OneToMany(
    () => ChatbotMessagesEntity,
    (chatbotMessages) => chatbotMessages.discussion,
    {
      nullable: true,
      eager: true,
      cascade: ['soft-remove'],
    },
  )
  messages: ChatbotMessagesEntity[];

  @ApiProperty({ description: 'The student who made the discussion' })
  @ManyToOne(() => User, (user) => user.chatbotDiscussions, {
    nullable: false,
  })
  user: User;
}
