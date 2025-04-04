import { CreateHashtagInput } from './create-hashtag.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHashtagInput extends PartialType(CreateHashtagInput) {
  @Field(() => Int)
  id: number;
}
