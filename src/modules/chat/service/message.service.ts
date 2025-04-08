import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../entities/message.entity";
import { Repository } from "typeorm";
import { ChatRoom } from "../entities/chat-room.entity";
import { UsersService } from "src/modules/users/users.service";
import { CreateMessageInput } from "../dto/create-message.input";
import { PubSub } from 'graphql-subscriptions';


@Injectable()
export class MessageService {
 constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    private usersService: UsersService,
    @Inject('PUB_SUB') private pubSub: PubSub
 ) {}
 
 async createMessage(createMessageInput: CreateMessageInput): Promise<Message> {
  const { content, senderId, roomId } = createMessageInput;
  
  const chatRoom = await this.chatRoomRepository.findOne({ 
    where: { id: roomId }
  });
  const user = await this.usersService.findOne(senderId);

  if (!chatRoom) {
    throw new NotFoundException(`채팅방 ID ${roomId}를 찾을 수 없습니다.`);
  }
  if (!user) {
    throw new NotFoundException(`사용자 ID ${senderId}를 찾을 수 없습니다.`);
  }

  const newMessage = this.messageRepository.create({
    content,
    sender: user,
    chatRoom
  });

  const savedMessage = await this.messageRepository.save(newMessage);
  const messageWithRelations = await this.messageRepository.findOne({
    where: { id: savedMessage.id },
    relations: ['sender', 'chatRoom']
  });

  if (!messageWithRelations) {
    throw new NotFoundException(`저장된 메시지를 찾을 수 없습니다.`);
  }

  await this.pubSub.publish('messageAdded', { messageAdded: messageWithRelations });

  return messageWithRelations;
}

 async getMessagesByChatRoom(roomId: number, page: number = 1, limit: number = 20): Promise<Message[]> {
    const skip = (page - 1) * limit;
  
    return this.messageRepository.find({
      where: { chatRoom: { id: roomId } },
      relations: ['sender', 'chatRoom'],
      order: { id: 'DESC' },
      skip,
      take: limit
    });
  }

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender']
    });
  
    if (!message) {
      throw new NotFoundException('메시지를 찾을 수 없습니다.');
    }
  
    if (message.sender.id !== userId) {
      throw new UnauthorizedException('메시지를 삭제할 권한이 없습니다.');
    }
  
    await this.messageRepository.remove(message);
    return true;
  }
}