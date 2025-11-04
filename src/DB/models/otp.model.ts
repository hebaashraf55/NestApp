/* eslint-disable @typescript-eslint/await-thenable */
import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OtpTypeEnum } from 'src/common/enums/user.enum';
import { emailEvent } from 'src/common/utils/events/email.event';
import { hash } from 'src/common/utils/security/hash.utils';

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: OtpTypeEnum,
  })
  type: string;
}

export const otpSchema = SchemaFactory.createForClass(Otp);
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 }); // ttl
otpSchema.pre(
  'save',
  async function (
    this: OtpDocument & { wasNew: boolean; plainOtp: string },
    next,
  ) {
    this.wasNew = this.isNew;
    if (this.isModified('code')) {
      this.plainOtp = this.code;
      this.code = await hash({ plainText: this.code });
      await this.populate('createdBy');
    }
    next();
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
otpSchema.post('save', async function (doc, next) {
  const that = this as OtpDocument & { wasNew: boolean; plainOtp: string };

  if (that.wasNew && that.plainOtp) {
    await emailEvent.emit('confirmeEmail', {
      otp: that.plainOtp,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userName: (that.createdBy as any).userName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      to: (that.createdBy as any).email,
    });
  }
});
export type OtpDocument = HydratedDocument<Otp>;

export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
