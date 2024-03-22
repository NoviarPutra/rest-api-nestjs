import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(registerAuthDto: RegisterAuthDto) {
    const checkEmail = await this.userRepository.findOne({
      where: { email: registerAuthDto.email },
    });

    if (checkEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hash(registerAuthDto.password, 10);

    const user = this.userRepository.create({
      ...registerAuthDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async validateUser(loginAuthDto: LoginAuthDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not found | wrong email');
    }

    // Check password
    const checkPassword = await compare(loginAuthDto.password, user.password);
    if (!checkPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    return user;
  }
}
