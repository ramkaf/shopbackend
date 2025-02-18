import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import duration from 'parse-duration';
import { TokenPayload } from './interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService:JwtService
  ) {}

  async login(user: User, response: Response) {
    const jwtExpiration = this.configService.getOrThrow<string>('JWT_EXPIRATION');
    const ms = require('ms');
    const milliseconds = ms(jwtExpiration);
  
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
  
    const expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + milliseconds);
  
    const token = this.jwtService.sign(tokenPayload);
    
    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires
    });
  
    return { tokenPayload };
  }

  async verifyUser(email: string, passowrd: string) {
    try {
      const user = await this.usersService.find({ email });
      const authenticated = await bcrypt.compare(passowrd, user.password);
      if (!authenticated)
        throw new UnauthorizedException('Creadentianl are not valid.');
      return user;
    } catch (error) {
      throw new UnauthorizedException('Creadentianl are not valid.');
    }
  }
}
