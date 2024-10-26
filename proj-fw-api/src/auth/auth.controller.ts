import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from 'src/auth/dto/requests/signin.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ResetPasswordDto } from './dto/requests/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.signIn(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Request() req, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.mailAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.authService.getMe(req.user.mUserId);
  }
}
