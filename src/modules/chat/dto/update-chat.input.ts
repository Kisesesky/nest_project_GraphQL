import { CreateChatRoomDto } from './create-chat.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatRoomDto) {
  @Field(() => Int)
  id: number;
}
