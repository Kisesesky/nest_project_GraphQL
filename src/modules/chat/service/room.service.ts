import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../../modules/users/users.service';
import { Repository } from 'typeorm';
import { CreateChatRoomDto } from '../dto/create-chat.input';
import { UpdateChatInput } from '../dto/update-chat.input';
import { ChatRoom } from '../entities/chat-room.entity';
import { JoinRoomDto } from '../dto/join-room.input';
import { User } from '../../../modules/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    private usersService: UsersService
  ) {}
  async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
    const { name, userId } = createChatRoomDto
    if(!name){
      throw new  BadRequestException('ChatRoom Name is Required')
    }
    const room = this.chatRoomRepository.create({
      name,
      owner: { id: userId },
      participants: [{ id: userId }]
    })
    return this.chatRoomRepository.save(room)
  }

  async joinChatRoom(joinRoomDto: JoinRoomDto) {
    const { roomId, name, participantId } = joinRoomDto
    const user = await this.usersService.findUserById(participantId)
    if(!user) {
      throw new NotFoundException('User Not Found')
    }
    let chatRoom:ChatRoom | null = null
    if(roomId) {
      chatRoom = await this.chatRoomRepository.findOne({
        where : { id: roomId},
        relations: ['participants']
      })
      if(!chatRoom) {
        throw new NotFoundException('ChatRoom Not Found')
      }

      const isAlreadyJoinedChatRoom = chatRoom.participants.some((participants)=>participants.id === user.id)
      if(isAlreadyJoinedChatRoom) {
        throw new BadRequestException('User is Already In ChatRoom')
      }
      chatRoom.participants.push( {id: user.id} as User)
      return this.chatRoomRepository.save(chatRoom)
    }
    
    const newChatRoom = this.chatRoomRepository.create({
      name: name || 'new ChatRoom',
      participants: [user]
    })
    return this.chatRoomRepository.save(newChatRoom)
  }
  
  async getUserRooms(userId: number) {
    const user = await this.chatRoomRepository.find({
      where : {
        participants: {
          id: userId
        }
      },
      relations: ['participants', 'owner']
    })
    return user
  }

  async getRoomByName(name: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { name },
      relations: ['participants', 'owner', 'message']
    })
    if(!room) {
      throw new NotFoundException('ChatRoom Not Found')
    }
    return room
  }
}