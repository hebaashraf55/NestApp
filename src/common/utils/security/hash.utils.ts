import bcrypt from 'bcrypt';

export const hash = async ({ plainText, salt = Number(process.env.SALT) }) => {
  return await bcrypt.hash(plainText, salt);
};
export const compare = async ({ plainText, hash }) => {
  return await bcrypt.compare(plainText, hash);
};
