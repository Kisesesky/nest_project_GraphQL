import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatRoomDto {
  @Field()
  name: string

  @Field()
  userId: number
}
