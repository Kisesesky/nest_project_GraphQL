import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HashtagService } from './hashtag.service';
import { Hashtag } from './entities/hashtag.entity';
import { CreateHashtagInput } from './dto/create-hashtag.input';
import { UpdateHashtagInput } from './dto/update-hashtag.input';
import { Post } from '../posts/entities/post.entity';

@Resolver(() => Hashtag)
export class HashtagResolver {
  constructor(private readonly hashtagService: HashtagService) {}

  @Mutation(() => Hashtag)
  createHashtag(@Args('createHashtagInput') createHashtagInput: CreateHashtagInput) {
    return this.hashtagService.createTags(createHashtagInput);
  }

  @Query(() => [Hashtag], { name: 'hashtag' })
  getTags() {
    return this.hashtagService.findAllTags();
  }

  @Query(() => Hashtag, { name: 'hashtag' })
  getTag(@Args('tagname') tagname: string) {
    return this.hashtagService.findTag(tagname);
  }

  @Query(() => [Post], { name: 'postsByHashtag' })
  async findPostsByHashtag(@Args('tagname') tagname: string) {
    const posts = await this.hashtagService.findPostsByTagname(tagname)
    console.log('\x1b[36m%s\x1b[0m', `
    -----------------------------------------------
    |          🔍 Fetching Posts by Hashtag       |
    -----------------------------------------------
    #️⃣ Requested Hashtag: ${tagname}  ✅ Found ${posts.length}
    `)
    posts.forEach(post => {
      console.log('\x1b[33m%s\x1b[0m', `
      ----------------------------------------------------------------------
      📝 Title: ${post.title}   ✍️ Author: ${post.author?.name || 'Unknown'}
      📅 Created At: ${post.createdAt}
      💬 Comments: ${post.comments ? post.comments.length : 0}개
      ----------------------------------------------------------------------
      `);
    })
    return posts
  }
}
