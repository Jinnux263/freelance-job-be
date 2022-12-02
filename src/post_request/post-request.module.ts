import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRequest } from './post-request.entity';
import { Module } from '@nestjs/common';
import { PostRequestController } from './post-request.controller';
import { PostRequestService } from './post-request.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostRequest]), UserModule],
  exports: [PostRequestService],
  controllers: [PostRequestController],
  providers: [PostRequestService],
})
export class PostRequestModule {}
