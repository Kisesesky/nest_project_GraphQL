import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../../modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@ObjectType()
@Entity()
export class Message {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  content: string

  @ManyToOne(()=> ChatRoom, chatroom=>chatroom.messages)
  @Field(()=> ChatRoom)
  chatRoom: ChatRoom

  @ManyToOne(()=> User, user=>user.message)
  @Field(()=>User)
  sender: User
}
