'use client';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import AuthProvider from './components/AuthProvider';
import { Provider } from 'react-redux';
import { store } from './store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={'font-noto-sans-jp font-normal min-h-screen'} lang="ja">
      <SessionProvider>
        <AuthProvider>
          <Provider store={store}>
            <body className={inter.className + ' bg-main'}>{children}</body>
          </Provider>
        </AuthProvider>
      </SessionProvider>
    </html>
  );
}
