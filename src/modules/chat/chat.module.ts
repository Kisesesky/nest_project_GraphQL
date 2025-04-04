import { Module } from '@nestjs/common';
import { ChatService } from './service/room.service';
import { ChatResolver } from './chat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message]),UsersModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
