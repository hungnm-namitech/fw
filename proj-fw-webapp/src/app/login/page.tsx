'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TextField } from '@/app/components/TextField';
import { Button } from '@/app/components/Button';
import { CheckBox } from '@/app/components/CheckBox';
import ResetPasswordModal from '@/app/molecules/ResetPasswordModal';
import { useForm } from 'react-hook-form';
import { createMessage } from '@/lib/utilities';
import { SignInResponse, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { VALIDATE } from '@/lib/constants';
import MESSAGES from '@/lib/messages';

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const { data: session, status } = useSession();
  const [signInError, setSignInError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      rememberMe: true,
    },
  });
  const onSubmit = async (data: LoginForm) => {
    setSignInError('');
    const res: SignInResponse | undefined = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
      rememberMe: data.rememberMe,
    });
    if (!res?.ok) setSignInError(res?.error as string);
    else setTimeout(() => router.push('/'), 0);
  };
  return (
    <div className={'w-full h-full flex min-w-[670px]'}>
      <div className="grid grid-cols-2 w-full">
        <div className={'flex items-center flex-col'}>
          <div className={'relative w-[250px] h-[150px] mt-[136px] mb-[45px]'}>
            <Image src={'/logo_fos.svg'} alt={'login logo'} fill />
          </div>
          {/* <p className={'font-inter leading-[normal] text-[26px] mb-[63px]'}>
          ここにシステム名が入ります。
        </p> */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-w-[320px] flex flex-col items-center"
          >
            <div className={'mb-6 w-full'}>
              <TextField
                className="max-h-[40px]"
                placeholder={'IDを入力してください'}
                label={'ログインID'}
                {...register('username', {
                  required: createMessage(
                    MESSAGES.REQUIRED_INPUT,
                    'ログインID',
                  ),
                })}
                name="username"
                error={errors?.username?.message?.toString()}
              />
            </div>
            <div className={'w-full relative'}>
              <p
                className={
                  'absolute top-0 left-[129px] text-[12px] leading-[150%] tracking-[0.06px] text-text-placeholder'
                }
              >
                5文字以上50文字以下
              </p>
              <TextField
                className="max-h-[40px]"
                placeholder={'パスワードを入力'}
                label={'パスワード'}
                {...register('password', {
                  required: createMessage(
                    MESSAGES.REQUIRED_INPUT,
                    'パスワード',
                  ),
                  minLength: {
                    value: 5,
                    message:
                      'パスワードは半角英数記号5桁以上50桁以下で入力してください',
                  },
                  maxLength: {
                    value: 50,
                    message:
                      'パスワードは半角英数記号5桁以上50桁以下で入力してください',
                  },
                })}
                name="password"
                type={showPassword ? 'password' : 'text'}
                error={errors?.password?.message?.toString()}
                classDiv={'max-w-[320px]'}
                action={
                  <p
                    className={
                      'text-primary text-[12px] leading-[150%] tracking-[0.06px] cursor-pointer'
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'パスワードを表示' : 'パスワードを非表示'}
                  </p>
                }
              />
            </div>
            <div className={'w-[280px] mt-10'}>
              <Button type="submit" color={'primary'}>
                ログイン
              </Button>
            </div>
            {!!signInError && (
              <span className="text-red-500 mt-3 max-w-[320px]">
                {signInError}
              </span>
            )}
          </form>
          <div className={'mt-4'}>
            <CheckBox
              label={'ログイン情報を保存する'}
              {...register('rememberMe')}
            />
          </div>

          <p
            onClick={() => {
              setResetPasswordModalOpen(true);
            }}
            className={
              'text-[#3C6255] text-[14px] leading-[150%] tracking-[0.07px] mt-5 cursor-pointer'
            }
          >
            パスワードをお忘れの場合
          </p>
        </div>
        <div className="h-full bg-[url('/login_bg.png')] bg-no-repeat	bg-cover bg-center aspect-auto"></div>
      </div>

      <ResetPasswordModal
        onClose={() => setResetPasswordModalOpen(false)}
        open={resetPasswordModalOpen}
      />
    </div>
  );
}
