import { ObjectType, Field, Int, ID, HideField, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { Exclude } from 'class-transformer';
import { Post } from '../../../modules/posts/entities/post.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { ChatRoom } from './../../chat/entities/chat-room.entity';
import { Message } from './../../chat/entities/message.entity';


export enum Role {
  ADMIN ='admin',
  COMMON = 'common'
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role type',
});

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(()=>ID)
  id: number

  @Column()
  @Field()
  name: string

  @Column({ unique: true })
  @Field()
  email: string

  @Column({ nullable: true })
  @HideField()
  @Exclude()
  password: string

  @Column({ default: Role.COMMON, type: 'enum', enum: Role })
  @Field(() => Role)
  roles: Role

  @CreateDateColumn()
  @Field()
  createdAt: Date

  @OneToMany(()=>Post, (post)=>post.author)
  @Field(()=>[Post], { nullable: true })
  posts: Post[]

  @OneToMany(()=>Comment,(comment)=>comment.user)
  @Field(()=>[Comment], { nullable:true })
  comments: Comment[]

  @ManyToMany(()=>ChatRoom, chatroom=>chatroom.participants)
  @Field(()=>[ChatRoom])
  chatrooms: ChatRoom[]

  @OneToMany(()=>Message, message=>message.sender)
  @Field(()=>[Message], { nullable:true })
  message: Message[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  async validatePassword(password: string):Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
