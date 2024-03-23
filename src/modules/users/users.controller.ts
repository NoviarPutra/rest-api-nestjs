import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiHeader,
  ApiHeaders,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @ApiBearerAuth()
  async findAll() {
    try {
      const user = await this.usersService.findAll();

      const userWithoutPassword = user.map((user) => {
        const { password, ...result } = user;
        return result;
      });
      return {
        status: 'ok',
        message: 'User fetched successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw error;
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
