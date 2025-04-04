import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHashtagInput } from './dto/create-hashtag.input';
import { UpdateHashtagInput } from './dto/update-hashtag.input';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagService {
  @InjectRepository(Hashtag)
  private hashtagRepository: Repository<Hashtag>
  async createTags(createHashtagInput: CreateHashtagInput) {
    const tag = this.hashtagRepository.create(createHashtagInput)
    return await this.hashtagRepository.save(tag)
  }

  async findAllTags() {
    return await this.hashtagRepository.find({
      relations: ['posts']
    })
  }

  async findTag(tagname: string) {
    const tag = await this.hashtagRepository.findOne({
      where : { tagname },
      relations: ['posts']
    })
    if(!tag){
      throw new NotFoundException('Not Founded Tag')
    }
    return tag
  }

  async findPostsByTagname(tagname: string) {
    const hashtag = await this.hashtagRepository.findOne({
      where: { tagname },
      relations: ['posts', 'posts.author']
    });
    
    if (!hashtag) {
      return [];
    }
    
    return hashtag.posts;
  }

  update(id: number, updateHashtagInput: UpdateHashtagInput) {
    return `This action updates a #${id} hashtag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashtag`;
  }
}
