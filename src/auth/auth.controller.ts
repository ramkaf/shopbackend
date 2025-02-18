import { Controller, Post, UseGuards, Body, Req, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { currentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login route
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @currentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  // Signup route
  @Post('signup')
  async signup(@Body() createUserDto: SignupDto) {
    // Validate the user and create a new one
    // const newUser = await this.authService.register(createUserDto);
    // return { message: 'User registered successfully!', user: newUser };
  }
}
