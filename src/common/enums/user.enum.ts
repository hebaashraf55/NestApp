export enum ProviderEnum {
  SYSTEM = 'SYSTEM',
  GOOGLE = 'GOOGLE',
}
export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum OtpTypeEnum {
  confirmEmail = 'CONFIRM EMAIL',
  resetPassword = 'RESET PASSWORD',
}
export enum OrderStatusEnum {
  "PLACED" = "placed",
  "PROCESSING" = "processing",
  "SHIPPED" = "shipped",
  "DELIVERED" = "delivered",
  "CANCELLED" = "cancelled",
}
export enum PaymentMethodEnum {
  CASH_ON_DELIVERY = "cash_on_delivery",
  ONLINE_PAYMENT = "online_payment",
}