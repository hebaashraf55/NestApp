import { Injectable, ConflictException } from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/DB/models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async signUp(
    signUpDTO: SignUpDTO,
  ): Promise<{ message: string; user: UserDocument }> {
    const { userName, email, password } = signUpDTO;
    const checkUser = await this.userModel.findOne({ email });

    if (checkUser) throw new ConflictException('User Already Exists');

    const [user] =
      (await this.userModel.create([{ userName, email, password }])) || [];

    return { message: 'User Register Successfully', user };
  }
}
