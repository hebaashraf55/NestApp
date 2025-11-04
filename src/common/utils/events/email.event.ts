import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { template } from '../email/sendEmail.template';
import { sendEmail } from '../email/send.email';
import { OtpTypeEnum } from 'src/common/enums/user.enum';

export const emailEvent = new EventEmitter();

interface IEmail extends Mail.Options {
  otp: string;
  userName: string;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
emailEvent.on('confirmeEmail', async (data: IEmail) => {
  try {
    data.subject = OtpTypeEnum.confirmEmail;
    data.html = template(data.otp, data.userName, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail to send email ${error}`);
  }
});
