import { Resolver, Mutation, Args, Int, Query, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { ChatService } from './service/room.service';
import { ChatRoom } from './entities/chat-room.entity';
import { CreateChatRoomDto } from './dto/create-chat.input';
import { JoinRoomDto } from './dto/join-room.input';
import { MessageService } from './service/message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { User } from '../users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver(() => ChatRoom)
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    @Inject('PUB_SUB') private pubSub: PubSub
  ) {}

  @Mutation(() => ChatRoom)
  async createChatRoom(
    @Args('createChatRoom') createChatRoomDto: CreateChatRoomDto,
  ) {
    return this.chatService.createChatRoom(createChatRoomDto)
  }

  @Mutation(() => ChatRoom)
  async joinChatRoom(
    @Args('joinChatRoom') joinRoomDto: JoinRoomDto,
  ) {
    return this.chatService.joinChatRoom(joinRoomDto)
  }

  @Query(() => [ChatRoom])
  async getUserRooms(@Args('userId', { type: () => Int }) userId: number) {
    return this.chatService.getUserRooms(userId)
  }

  @Query(() => ChatRoom)
  async getRoomByName(@Args('name') name: string) {
    return this.chatService.getRoomByName(name)
  }

  @Mutation(() => Message)
  async createMessage(
  @Args('createMessage') createMessageInput: CreateMessageInput
  ): Promise<Message> {
  const message = await this.messageService.createMessage(createMessageInput);
  await this.pubSub.publish('messageAdd', { messageAdd: message });
  return message;
}

  @Mutation(() => Boolean)
  async deleteMessage(
    @Args('messageId') messageId: number,
    @Args('userId') userId: number
  ): Promise<boolean> {
    return this.messageService.deleteMessage(messageId, userId);
  }

  @Query(() => [Message])
  async getMessages(
    @Args('roomId') roomId: number,
    @Args('page', { nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number
  ): Promise<Message[]> {
    return this.messageService.getMessagesByChatRoom(roomId, page, limit);
  }

  @ResolveField(() => User)
  async owner(@Parent() chatRoom: ChatRoom) {
    return chatRoom.owner;
  }

  @ResolveField(() => [Message])
  async messages(@Parent() chatRoom: ChatRoom) {
    return chatRoom.messages;
  }

  @ResolveField(() => [User])
  async users(@Parent() chatRoom: ChatRoom) {
    return chatRoom.users;
  }

  @Subscription(() => Message, {
    filter: (payload: { messageAdded: Message }, variables) => {
      return payload.messageAdded.chatRoom.id === variables.chatRoomId;
    }
  })
  messageAdded(@Args('chatRoomId', { type: () => Int }) chatRoomId: number) {
    return this.pubSub.asyncIterableIterator('messageAdded');
  }
}
