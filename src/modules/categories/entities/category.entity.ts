import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Post } from '../../../modules/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column({ unique: true })
  @Field()
  name: string

  @OneToMany(()=> Post, post => post.category)
  @Field(() => [Post])
  posts: Post[]
}
