import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagResolver } from './hashtag.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './entities/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag])],
  providers: [HashtagResolver, HashtagService],
  exports: [TypeOrmModule]
})
export class HashtagModule {}
