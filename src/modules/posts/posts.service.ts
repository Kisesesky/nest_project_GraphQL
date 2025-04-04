import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { CommentsService } from '../comments/comments.service';
import { Hashtag } from '../hashtag/entities/hashtag.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private commentsService: CommentsService,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    let category = await this.categoryRepository.findOne({
      where: { name: createPostDto.category}
    })
    if(!category) {
      category = this.categoryRepository.create({
        name: createPostDto.category
      })
      await this.categoryRepository.save(category)
    }

    let hashtags = await Promise.all(
      (createPostDto.hashtags || []).map(async (tagname) => {
        let hashtag = await this.hashtagRepository.findOne({ where: { tagname } });
        if (!hashtag) {
          hashtag = this.hashtagRepository.create({ tagname });
          await this.hashtagRepository.save(hashtag);
        }
        return hashtag;
      })
    );

    const post = this.postRepository.create({
      ...createPostDto,
      author: user,
      hashtags: hashtags,
      category: category
    });

    const savedPost = await this.postRepository.save(post);
    
    return this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['hashtags','category']
    });
  }

  async findPosts() {
    const posts = await this.postRepository.find({
      relations: {
        author: true,
        hashtags: true,
        comments: true
      }
    });
    return posts;
  }

  async findByPostId(id: number) {
    const post = await this.postRepository.findOne({ 
      where: { id },
      relations: {
        author: true,
        comments: true,
        hashtags: true,
        category: true,
      }
    });
    return post;
  }

  async findCommentsByPostId(postId: number) {
    return this.commentsService.findCommentsByPostId(postId)
  }
}
