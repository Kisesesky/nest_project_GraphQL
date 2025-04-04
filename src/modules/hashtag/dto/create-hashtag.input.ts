import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHashtagInput {
  @Field()
  tagname: string
}
