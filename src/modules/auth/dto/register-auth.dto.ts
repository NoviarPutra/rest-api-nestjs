import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterScheme = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
      ),
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export class RegisterAuthDto extends createZodDto(RegisterScheme) {
  @ApiProperty({ type: String, example: 'John Doe', required: true })
  name: string;

  @ApiProperty({ type: String, example: 'wvZ8H@example.com', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'password@123', required: true })
  password: string;

  @ApiProperty({
    type: String,
    enum: ['USER', 'ADMIN'],
    example: 'USER',
    default: 'USER',
    required: false,
  })
  role: 'USER' | 'ADMIN' = 'USER';
}
