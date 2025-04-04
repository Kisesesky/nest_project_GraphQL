import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { CommentsModule } from '../comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from '../hashtag/hashtag.module';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { CategoryModule } from '../categories/category.module';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Hashtag, Category]), CommentsModule, HashtagModule, CategoryModule],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
