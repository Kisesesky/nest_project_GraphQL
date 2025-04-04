import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Post } from '../posts/entities/post.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Post])
    async getPostsByCategory(@Args('categoryName') categoryName: string) {
      const posts = await this.categoryService.findPostsByCategory(categoryName);
      console.log('\x1b[36m%s\x1b[0m', `
      -----------------------------------------------
      |        🔍 Fetching Posts by Category        |
      -----------------------------------------------
      
      📁 Category: ${categoryName}
      ✅ Found ${posts.length} posts
      `);

      posts.forEach(post => {
        console.log('\x1b[32m%s\x1b[0m', `
        ----------------------------------------------------------------------
        📝 Title: ${post.title}    ✍️ Author: ${post.author?.name || 'Unknown'}
        📅 Created At: ${post.createdAt}
        #️⃣ HashTags: ${post.hashtags?.map(tag => tag.tagname).join(', ') || 'No hashtags'}
        ----------------------------------------------------------------------
        `);
      });

      return posts;
    }

}
