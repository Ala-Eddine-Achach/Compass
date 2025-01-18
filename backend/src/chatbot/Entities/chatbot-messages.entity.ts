import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entities';
import { ChatbotDiscussionsEntity } from './chatbot-discussions.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity('chatbot_messages')
export class ChatbotMessagesEntity extends TimestampEntites {
  @ApiProperty({ description: 'The id of the chatbot message' })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ description: 'The chatbot discussion of the message' })
  @ManyToOne(
    () => ChatbotDiscussionsEntity,
    (chatbotDiscussions) => chatbotDiscussions.id,
    {
      nullable: false,
    },
  )
  discussion: ChatbotDiscussionsEntity;
  @ApiProperty({ description: 'The image of the message' })
  @Column({
    nullable: true,
  })
  image: string;
  @ApiProperty({ description: 'The prompt of the message' })
  @Column({
    type: 'mediumtext',
  })
  prompt: string;
  @ApiProperty({ description: 'The response of the message' })
  @Column({
    type: 'mediumtext',
  })
  response: string;
}
