import { publicAxiosInstance } from './axios-instance';

export const resetPassword = (mailAddress: string) =>
  publicAxiosInstance.post('/auth/reset-password', { mailAddress });
