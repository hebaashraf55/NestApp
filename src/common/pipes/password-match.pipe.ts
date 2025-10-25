import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordMatchPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { password, confirmPassword } = value;
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and ConfirmPassword does not Match',
      );
    }
    return value;
  }
}
