import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: RegisterAuthDto) {
    try {
      const check = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (check) {
        throw new BadRequestException('Email already exists');
      }

      const hashPassword = await hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: { ...data, password: hashPassword },
      });

      const { password, ...result } = user;

      return {
        status: 'created',
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginAuthDto) {}
}
