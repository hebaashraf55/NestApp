import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  type ResendDTO,
  signUpSchema,
  type SignUpDTO,
  resendOtpSchema,
  type ConfirmEmailDTO,
  confirmEmailSchema,
  logInSchema,
  type LogInDTO,
} from './dto/signup.dto';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoggingInterceptor } from 'src/common/interceptors/loggers.interceptor';


// @UseInterceptors(LoggingInterceptor)
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signUpSchema))
  @Post('/signup')
  signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @UsePipes(new ZodValidationPipe(resendOtpSchema))
  @Post('/resend-otp')
  resendOtp(@Body() resendOtp: ResendDTO) {
    return this.authService.resendOtp(resendOtp);
  }

  @UsePipes(new ZodValidationPipe(confirmEmailSchema))
  @Patch('/confirm-email')
  confirmEmail(@Body() confirmEmailDTO: ConfirmEmailDTO) {
    return this.authService.confirmEmail(confirmEmailDTO);
  }

  @UsePipes(new ZodValidationPipe(logInSchema))
  @Post('/login')
  logIn(@Body() logInDTO: LogInDTO) {
    return this.authService.logIn(logInDTO);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  profile(@Req() req: any) {
    return this.authService.getProfile(req);
  }
}
