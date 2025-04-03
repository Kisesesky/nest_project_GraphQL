import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { Post } from '../../../modules/posts/entities/post.entity';


@ObjectType()
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() =>ID)
  id: number

  @Column()
  @Field()
  content: string

  @CreateDateColumn()
  @Field()
  createdAt: Date

  @ManyToOne(()=> User, (user)=>user.comments, { eager: false })
  @Field(()=>User)
  user: User;

  @ManyToOne(()=> Post, (post)=>post.comments, { eager: false })
  @Field(()=> Post)
  post: Post
}
