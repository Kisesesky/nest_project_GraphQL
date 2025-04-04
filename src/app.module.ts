import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/entities/post.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { CommentsModule } from './modules/comments/comments.module';
import { HashtagModule } from './modules/hashtag/hashtag.module';
import { Hashtag } from './modules/hashtag/entities/hashtag.entity';
import { CategoryModule } from './modules/categories/category.module';
import { Category } from './modules/categories/entities/category.entity';
import { ChatModule } from './modules/chat/chat.module';
import { ChatRoom } from './modules/chat/entities/chat-room.entity';
import { Message } from './modules/chat/entities/message.entity';


@Module({
  imports: [UsersModule,CommentsModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'nest_grephql',
    entities: [User,Post,Comment,Hashtag,Category,ChatRoom,Message],
    synchronize: true,
  }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true
      },
      context: ({ req, res }) => ({ req, res })
    }),
    PostsModule,
    HashtagModule,
    CategoryModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
