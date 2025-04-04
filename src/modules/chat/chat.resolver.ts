import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { ChatService } from './service/room.service';
import { ChatRoom } from './entities/chat-room.entity';
import { CreateChatRoomDto } from './dto/create-chat.input';
import { JoinRoomDto } from './dto/join-room.input';

@Resolver(() => ChatRoom)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(()=> ChatRoom)
  async createChatRoom(
    @Args('createChatRoom') createChatRoomDto: CreateChatRoomDto,
    ) {
    return this.chatService.createChatRoom(createChatRoomDto)
  }

  @Mutation(()=> ChatRoom)
  async joinChatRoom(
    @Args('joinChatRoom') joinRoomDto: JoinRoomDto,
  ) {
    return this.chatService.joinChatRoom(joinRoomDto)
  }

  @Query(()=> [ChatRoom])
  async getUserRooms (@Args('userId', {type: ()=>Int}) userId: number) {
    return this.chatService.getUserRooms(userId)
  }

  @Query(()=> ChatRoom)
  async getRoomByName (@Args('name') name: string) {
    return this.chatService.getRoomByName(name)
  }
}
