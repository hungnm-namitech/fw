import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

let signedOut = false;
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_API_URL,
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_API_URL,
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  async v => {
    if (v.status === 200) return v.data;
    return v;
  },
  async error => {
    const session = await getSession();
    if (!session) return;
    if (error?.response?.status === 401) {
      if (signedOut === false) {
        signedOut = true;
        alert('ログインしてください');
        return signOut().then(() => signedOut = false);
      } else return;
    }
    window.location.href = '/503';
  },
);
