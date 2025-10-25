import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpSchema, type SignUpDTO } from './dto/signup.dto';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signUpSchema))
  @Post('/signup')
  signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }
}
