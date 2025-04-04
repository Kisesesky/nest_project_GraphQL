import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../../modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@ObjectType()
@Entity()
export class ChatRoom {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @CreateDateColumn()
  @Field()
  createdAt: Date

  @Field(()=> User)
  @ManyToOne(()=>User)
  @JoinTable()
  owner: User

  @OneToMany(()=>Message, message=>message.chatRoom)
  @Field(()=> [Message])
  messages: Message

  @ManyToMany(()=>User, user=>user.chatrooms)
  @JoinTable()
  @Field(()=> [User])
  participants: User[]
}
