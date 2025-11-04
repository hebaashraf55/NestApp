import z from 'zod';
import { GenderEnum, RoleEnum, ProviderEnum } from 'src/common/enums/user.enum';

// sign up
export const signUpSchema = z
  .strictObject({
    firstName: z.string().min(2).max(20).optional(),
    lastName: z.string().min(2).max(20).optional(),
    userName: z.string().min(2).max(45),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    gender: z.enum(GenderEnum).optional().default(GenderEnum.MALE),
    role: z.enum(RoleEnum).optional().default(RoleEnum.USER),
    provider: z.enum(ProviderEnum).optional().default(ProviderEnum.SYSTEM),
    DOB: z.date().optional(),
    age: z.number().min(18).max(60).optional(),
    phone: z
      .string()
      .refine(
        (val) => {
          const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
          return phoneRegex.test(val);
        },
        {
          message: 'Invalid Egyption Phone number',
        },
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and ConfirmPassword does not Match',
    path: ['confirmPassword'],
  });
export type SignUpDTO = z.infer<typeof signUpSchema>;

// resend otp
export const resendOtpSchema = z.strictObject({
  email: z.string().email(),
});
export type ResendDTO = z.infer<typeof resendOtpSchema>;

// confirm email
export const confirmEmailSchema = z.strictObject({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});
export type ConfirmEmailDTO = z.infer<typeof confirmEmailSchema>;

export const logInSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LogInDTO = z.infer<typeof logInSchema>;
