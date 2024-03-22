import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from './decorator/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Public()
@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ZodValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    isArray: false,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exists',
  })
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

  @Post('login')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    isArray: false,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong password',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.authService.validateUser(loginAuthDto);
      const { password, ...result } = user;
      return {
        status: 'ok',
        message: 'User logged in successfully',
        token: await this.jwtService.signAsync({ ...result }),
      };
    } catch (error) {
      throw error;
    } finally {
      console.log('Done');
    }
  }
}
