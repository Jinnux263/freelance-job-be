import { UserCreation } from './../user/user.dto';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyTokenBody } from './auth.request';
import { AuthUser, Public } from './auth-user.decorator';
import { User } from '../user/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthenticationGuard } from './auth.guard';
import {
  ILoginResponse,
  IRequestWithUser,
  ResetPassRequest,
  ResetPassResponse,
} from './auth.dto';

@ApiTags('Auth Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('verify')
  @ApiBearerAuth()
  verifyToken(
    @Request() request: { user: AuthUser },
    @Body() body: VerifyTokenBody,
  ): Promise<User> {
    return this.authService.verifyToken(body, request.user);
  }
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: IRequestWithUser): Promise<ILoginResponse> {
    return request.user as any;
  }
  @Public()
  @HttpCode(200)
  @Post('password/reset')
  async resetPass(@Body() user: ResetPassRequest): Promise<ResetPassResponse> {
    return this.authService.resetPassword(user);
  }

  @Public()
  @HttpCode(200)
  @Post('signup')
  async signUp(@Body() user: UserCreation): Promise<any> {
    return this.authService.signUp(user);
  }
}
