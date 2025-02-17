import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor (private readonly prismaService:PrismaService){}
  
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data : {
          ...createUserDto,
          password : await bcrypt.hash(createUserDto.password , 10)
        },
        select : {
          email : true,
          id : true
        }
      })
    } catch (error) {
      if (error.code === 'P2002')
        throw new UnprocessableEntityException('email already exist')
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
