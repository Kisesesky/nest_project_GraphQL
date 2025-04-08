import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  content: string

  @Field()
  senderId: number

  @Field()
  roomId: number
}
