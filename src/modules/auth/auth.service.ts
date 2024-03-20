import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

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
}
