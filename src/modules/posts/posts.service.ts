import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments/comments.service';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private commentsService: CommentsService
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = this.postRepository.create({
      ...createPostDto,
      author: user
    })
    return this.postRepository.save(post)
  }

  async findPosts() {
    return await this.postRepository.find({
      relations: ['author']
    })
  }

  async findByPostId(id: number) {
    return this.postRepository.findOne({ where: { id }, relations: ['author', 'comments']})
  }

  async findCommentsByPostId(postId: number) {
    return this.commentsService.findCommentsByPostId(postId)
  }
}
