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
  })
  confirmEmailOTP: string;

  @Prop({
    type: String,
    required: function () {
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
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash({ plainText: this.password });
  }
  next();
});

export type UserDocument = HydratedDocument<User>;

export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
