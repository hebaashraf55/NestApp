import z from 'zod';
import { GenderEnum, RoleEnum, ProviderEnum } from 'src/common/enums/user.enum';

// export class SignUpDTO {
//   @IsString({ message: 'FirstName must be a string' })
//   @Length(2, 20, { message: 'FirstName must be between 2 and 20 characters' })
//   @IsNotEmpty({ message: 'FirstName is required' })
//   firstName: string;

//   @IsString({ message: 'LastName must be a string' })
//   @Length(2, 20, { message: 'LastName must be between 2 and 20 characters' })
//   @IsNotEmpty({ message: 'LastName is required' })
//   lastName: string;

//   @IsString({ message: 'UserName must be a string' })
//   @Length(2, 40, { message: 'UserName must be between 2 and 40 characters' })
//   userName: string;

//   @IsEmail({}, { message: 'Email is not valid' })
//   email: string;

//   @IsStrongPassword()
//   password: string;

//   @IsEnum(GenderEnum, { message: 'Gender must be either MALE or FEMALE' })
//   gender: string;

//   @IsEnum(RoleEnum, { message: 'Role must be either ADMIN or USER' })
//   role: string;

//   @IsPhoneNumber('EG', { message: 'Invalid Egyption Phone number' })
//   phone: string;

//   // @IsDate({ message: 'DOB must be a valid date' })
//   // DOB: Date;

//   @IsInt({ message: 'Age must be an integer' })
//   @Min(18, { message: 'Age must be at least 18' })
//   @Max(60, { message: 'Age must be at most 100' })
//   age: number;
// }

// zod

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
