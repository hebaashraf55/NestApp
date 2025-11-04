import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ConfirmEmailDTO,
  LogInDTO,
  ResendDTO,
  SignUpDTO,
} from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/DB/models/user.model';
import { Model, Types } from 'mongoose';
import { Otp, OtpDocument } from 'src/DB/models/otp.model';
import { OtpTypeEnum, ProviderEnum } from 'src/common/enums/user.enum';
import { generateOtp } from 'src/common/utils/otp.utils';
import { compare } from 'src/common/utils/security/hash.utils';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private jwtService: JwtService,
  ) {}
  private async createOtp(userId: Types.ObjectId) {
    await this.otpModel.create({
      createdBy: userId,
      code: generateOtp(),
      expiredAt: new Date(Date.now() + 2 * 60 * 1000),
      type: OtpTypeEnum.confirmEmail,
    });
  }
  async signUp(
    signUpDTO: SignUpDTO,
  ): Promise<{ message: string; user: UserDocument }> {
    const { userName, email, password } = signUpDTO;
    const checkUser = await this.userModel.findOne({ email });

    if (checkUser) throw new ConflictException('User Already Exists');

    const [user] =
      (await this.userModel.create([{ userName, email, password }])) || [];

    await this.createOtp(user._id);

    return { message: 'User Register Successfully', user };
  }
  async resendOtp(resendDTO: ResendDTO) {
    const { email } = resendDTO;
    const user = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([{ path: 'otp', match: { type: OtpTypeEnum.confirmEmail } }]);
    if (!user) throw new NotFoundException('User Not Found');
    if (user.otp?.length) throw new ConflictException('OTP Already Sent');
    await this.createOtp(user._id);
    return { message: 'OTP Send Successfully' };
  }
  async confirmEmail(confirmEmailDTO: ConfirmEmailDTO) {
    const { email, otp } = confirmEmailDTO;
    const user = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([{ path: 'otp', match: { type: OtpTypeEnum.confirmEmail } }]);
    if (!user) throw new NotFoundException('User Not Found');
    if (!user.otp?.length) throw new ConflictException('OTP Already Sent');
    if (!(await compare({ plainText: otp, hash: user.otp[0].code })))
      throw new BadRequestException('Invalid OTP');

    await this.userModel.updateOne(
      { _id: user._id },
      { $set: { confirmEmail: new Date() }, $inc: { __v: 1 } },
    );
    return { message: 'User Confirmed Successfully' };
  }
  async logIn(ogInDTO: LogInDTO) {
    const { email, password } = ogInDTO;
    const user = await this.userModel.findOne({
      email,
      confirmEmail: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    });
    if (!user) throw new NotFoundException('User Not Found');
    if (!(await compare({ plainText: password, hash: user.password })))
      throw new BadRequestException('Invalid Password');

    const jwtid = randomUUID();
    const accessToken = this.jwtService.sign(
      {
        userId: user._id,
        email: user.email,
      },
      {
        secret: process.env.ACCESS_SECRET_KEY,
        expiresIn: Number(process.env.ACCESS_EXPIRES_IN as string),
        jwtid,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user._id,
        email: user.email,
      },
      {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: Number(process.env.REFRESH_EXPIRES_IN as string),
        jwtid,
      },
    );
    return {
      message: 'User Logged In Successfully',
      Credentials: { accessToken, refreshToken },
    };
  }
  async getProfile(req: any) {
    return { message: 'User Profile Featched Successfully', data: req.user };
  }

  
}
