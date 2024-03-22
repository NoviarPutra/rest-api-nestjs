import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
const LoginScheme = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
export class LoginAuthDto extends createZodDto(LoginScheme) {
  @ApiProperty({ type: String, example: 'email@example.com', required: true })
  email: string;

  @ApiProperty({ type: String, example: 'Password', required: true })
  password: string;
}
