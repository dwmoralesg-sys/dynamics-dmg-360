import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }

  @Post('change-password')
  @HttpCode(200)
  changePassword(@CurrentUser('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }
}
