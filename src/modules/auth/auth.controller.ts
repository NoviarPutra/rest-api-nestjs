import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
  async login(@Body() data: LoginAuthDto) {
    try {
      // CHECK USER BY EMAIL
      const user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // CHECK PASSWORD
      const match = await compare(data.password, user.password);
      if (!match) {
        throw new UnauthorizedException('Wrong password');
      }

      // CREATE TOKEN
      const { password, ...result } = user;
      const token = await this.jwtService.signAsync({ ...result });

      return {
        status: 'success',
        message: 'User logged in successfully',
        data: token,
      };
    } catch (error) {
      throw error;
    }
  }
}
