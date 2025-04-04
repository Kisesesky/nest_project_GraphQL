import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field()
  content: string

  @Field()
  sender: string

  @Field()
  roomId: string
}
