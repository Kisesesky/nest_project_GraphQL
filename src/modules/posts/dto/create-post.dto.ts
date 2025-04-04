import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreatePostDto {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsString()
  content: string

  @Field(()=> [String], { nullable: true })
  hashtags?: string[]

  @Field()
  category: string

}
