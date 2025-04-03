import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(()=> ID)
  id: number
  
  @Column()
  @Field()
  title:string

  @Column()
  @Field()
  content:string

  @CreateDateColumn()
  @Field()
  createdAt: Date

  
  @OneToMany(()=>Comment, (comment)=>comment.post, { eager: false })
  @Field(()=>[Comment], { nullable:true })
  comments: Comment[]

  @ManyToOne(()=> User,(user)=>user.posts, { eager: true })
  @Field(()=>User, { nullable: true })
  author: User
}
