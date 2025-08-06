export type AuthT = {
  id: string;
  email: string;
  otp: number;
  isOtpUsed: boolean;
  otpExpiresAt: string;
  isVerified: boolean;
  isInternal: boolean;
};

export interface UserI {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  authId: string;
  auth: AuthT;
}
