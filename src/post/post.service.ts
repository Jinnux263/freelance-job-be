import { AuthUser } from 'src/auth/auth-user.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  async createPost(authUser: AuthUser, body: any): Promise<any> {
    return 'OK';
  }
  async getPostById(authUser: AuthUser, id: string): Promise<any> {
    return 'OK';
  }
  async getPosts(authUser: AuthUser): Promise<any> {
    return 'OK';
  }
  async getPostOfUser(authUser: AuthUser, userId: string): Promise<any> {
    return 'OK';
  }
  async updatePost(authUser: AuthUser, id: string, body: any): Promise<any> {
    return 'OK';
  }
  async deletePost(authUser: AuthUser, id: string): Promise<any> {
    return 'OK';
  }
}
