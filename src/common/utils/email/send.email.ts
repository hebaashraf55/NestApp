import { BadRequestException } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmail = async (data: Mail.Options): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!data.html && !data.text && !data.attachments?.length)
    throw new BadRequestException('Missing email content');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  > = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const info = await transporter.sendMail({
    ...data,
    from: `'Route Academy' <${process.env.EMAIL_USERNAME as string}>`,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log(info.messageId);
};
