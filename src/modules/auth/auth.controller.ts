import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() registerAuthDto: RegisterAuthDto) {
    try {
      const user = await this.authService.create(registerAuthDto);

      const { password, ...result } = user;

      return {
        status: 'created',
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    } finally {
      console.log('Done');
    }
  }
}
