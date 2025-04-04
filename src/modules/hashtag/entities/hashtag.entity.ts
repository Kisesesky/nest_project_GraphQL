import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../../modules/posts/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn()
  @Field(()=> ID)
  id: number

  @Column({ nullable: true })
  @Field()
  tagname: string

  @ManyToMany(() => Post, post => post.hashtags)
  @Field(() => [Post])
  posts: Post[]
}
