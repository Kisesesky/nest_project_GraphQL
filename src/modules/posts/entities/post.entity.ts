import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { Hashtag } from '../../../modules/hashtag/entities/hashtag.entity';
import { Category } from '../../../modules/categories/entities/category.entity';

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

  @ManyToOne(()=> User,(user)=>user.posts, { eager: false })
  @Field(()=>User, { nullable: true })
  author: User

  @ManyToMany(() => Hashtag, hashtag => hashtag.posts)
  @JoinTable({
    name: 'hashtag_post'
  })
  @Field(() => [Hashtag], { nullable: true })
  hashtags: Hashtag[]

  @ManyToOne(()=> Category, category => category.posts)
  @Field(()=> Category)
  category: Category
}
