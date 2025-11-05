import {
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
  MongooseModule,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum } from 'src/common/enums/user.enum';
import { hash } from 'src/common/utils/security/hash.utils';
import { OtpDocument } from './otp.model';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  lastName: string;

  @Virtual({
    get: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.firstName + ' ' + this.lastName;
    },
    set: function (value) {
      const [firstName, lastName] = value.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  userName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: Date,
  })
  confirmEmail: Date;

  @Prop({
    type: String,
    required: function () {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.provider !== ProviderEnum.GOOGLE ? false : true;
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(ProviderEnum),
      message: `{values} is not valid provider`,
    },
    default: ProviderEnum.SYSTEM,
  })
  provider: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: `{values} is not valid gender`,
    },
    default: GenderEnum.MALE,
  })
  gender: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Virtual()
  otp: OtpDocument[];
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash({ plainText: this.password });
  }
  next();
});

userSchema.virtual('otp', {
  ref: 'Otp',
  localField: '_id',
  foreignField: 'createdBy',
});

export type UserDocument = HydratedDocument<User>;

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
