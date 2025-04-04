import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { JwtGuards } from '../users/guards/jwt.guards';


@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtGuards)
  @Mutation(()=> Post)
  async createPost(
    @Args('createPostDto') createPostDto: CreatePostDto,
    @RequestUser() user: User
    ) {
    const postWrite = await this.postsService.createPost(createPostDto, user)
    console.log('\x1b[34m%s\x1b[0m', `
    -----------------------------------------------
    |            🔹 🎊Post Write Success🎊        |
    -----------------------------------------------
    `)
    console.log('\x1b[34m%s\x1b[0m',`title: ${createPostDto.title}\ncontent: ${createPostDto.content}\nAuthor: ${user.name}\nHashTags: ${createPostDto.hashtags?.join(', ')}\nCategory: ${createPostDto.category}`)
    return postWrite
  }

  @Query(()=>Post)
  async getPost(@Args('id') id: number) {
    const post = await this.postsService.findByPostId(id)
    if(!post) {
      console.log(`Post with PostId: ${id} Not Found`)
      throw new NotFoundException(`Post with PostId: ${id} Not Found`)
    }
    console.log('\x1b[36m%s\x1b[0m', `
    -----------------------------------------------
    |            🔍 Fetching Post Info            |
    -----------------------------------------------
    🆔 Requested Post ID: ${id}
    `)
    console.log('\x1b[32m%s\x1b[0m', `
      ✅ Post Found!
      🆔 ID: ${post.id}   📝 Title: ${post.title}    ✍️ Author: ${post.author?.name || 'Unknown'}    📁 Category: ${post.category?.name || 'Unknown'}
      📄 Content: ${post.content}
      📅 Created At: ${post.createdAt}
      #️⃣ HashTags: ${post.hashtags?.map(tag => tag.tagname).join(', ') || 'No hashtags'}
      💬 Comments: ${post.comments ? post.comments.length : 0}개
      ----------------------------------------------------------------------
      `);
      if (post.comments && post.comments.length > 0) {
        console.log('\x1b[33m%s\x1b[0m', `🗨️ Comments:`);
    
        post.comments.forEach((comment, index) => {
          console.log('\x1b[35m%s\x1b[0m', `
          🔹 Comment ${index + 1}:
          ✍️ Author: ${comment.user?.id || 'Unknown'}
          💬 Content: ${comment.content}
          `);
        });
    
        console.log('----------------------------------------------------------------------');
      }
    return post
  }

  @Query(()=>[Post])
  async getPosts() {
    const postList = await this.postsService.findPosts()
    console.log('\x1b[36m%s\x1b[0m', `
      -----------------------------------------------
      |            📜 All Posts Retrieved          |
      -----------------------------------------------
      `);
    
      postList.forEach(post => {
        console.log('\x1b[32m%s\x1b[0m', `
        🆔 PostID: ${post.id}   📝 Title: ${post.title}    ✍️ Author: ${post.author?.name || 'Unknown'}    📁 Category: ${post.category?.name || 'Unknown'}
        📄 Content: ${post.content}
        📅 Created At: ${post.createdAt}
        #️⃣ HashTags: ${post.hashtags?.map(tag => tag.tagname).join(', ') || 'No hashtags'}
        💬 Comments: ${post.comments ? post.comments.length : 0}개
        ----------------------------------------------------------------------
        `);
      });
    return postList
  }

  @ResolveField(()=>[Comment], { name: 'comments', nullable: true })
  async getComments(@Parent() post: Post) {
    return await this.postsService.findCommentsByPostId(post.id)
  }
}
