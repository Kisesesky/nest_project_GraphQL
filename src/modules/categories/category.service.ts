import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  @InjectRepository(Category)
  private categoryRepository : Repository<Category>
  async findPostsByCategory(categoryName: string) {
    const category = await this.categoryRepository.findOne({
      where : { name: categoryName},
      relations: {
        posts: {
          author: true,
          hashtags: true
        }
      }
    })
    if(!category) {
      return []
    }
    return category.posts
  }
}
