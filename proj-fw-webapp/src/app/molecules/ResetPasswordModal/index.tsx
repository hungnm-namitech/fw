import { Modal } from '@/app/components/Modal';
import { TextField } from '@/app/components/TextField';
import { Button } from '@/app/components/Button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createMessage } from '@/lib/utilities';
import MESSAGES from '@/lib/messages';
import { resetPassword } from '@/app/service/userservice';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

interface ResetPasswordForm {
  email: string;
}

export default function ResetPasswordModal({
  open,
  onClose,
}: ResetPasswordModalProps) {
  const [step, setStep] = useState(1);
  const handleFirstStep = () => {
    setStep(2);
  };

  const resetModalState = () => {
    setStep(1);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordForm>();

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword(data.email);
      handleFirstStep();
    } catch (error) {
      setError('email', { message: MESSAGES['EMAIL_NOT_EXIST'] });
    }
  };

  const reSendResetPassword = async () => {
    try {
      await resetPassword(watch('email'));
      handleFirstStep();
      handleClose();
    } catch (error) {
      setError('email', { message: MESSAGES['EMAIL_NOT_EXIST'] });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {step === 1 && (
        <div
          className={
            'flex flex-col  items-center w-[520px] py-[60px] px-[48px] !font-noto-sans-jp'
          }
        >
          <p
            className={
              'text-text-black text-center text-[24px] font-bold leading-[125%] mb-[27px]'
            }
          >
            パスワード再発行
          </p>
          <p
            className={
              'text-text-black text-[14px] leading-[150%] tracking-[0.07px] text-center mb-6'
            }
          >
            メールアドレスを入力のうえ、送信ボタンを押してください。
            パスワード再発行用URLを記載したメールをお送りします。
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              placeholder={'メールアドレスを入力してください'}
              {...register('email', {
                required: createMessage(
                  MESSAGES.REQUIRED_INPUT,
                  'メールアドレス',
                ),
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: createMessage(MESSAGES.EMAIL_VALIDATE),
                },
              })}
              name="email"
              error={errors?.email?.message?.toString()}
            />
            <div className={'w-[280px] mt-6'}>
              <Button type="submit">送信</Button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <div
          className={
            'flex flex-col  items-center w-[520px] py-[60px] px-[48px]'
          }
        >
          <p
            className={
              'text-text-black text-center text-[24px] font-bold leading-[125%] mb-[27px]'
            }
          >
            パスワード再発行
          </p>
          <p
            className={
              'text-text-black text-[14px] leading-[150%] tracking-[0.07px] text-center mb-6'
            }
          >
            パスワード変更用のメールを送信しました
          </p>
          <div className={'bg-gray py-4 px-5'}>
            <p
              className={
                'text-text-black text-[12px] font-bold leading-[150%] tracking-[0.06px] mb-3'
              }
            >
              メールが届かない場合
            </p>
            <ul className={'list-disc list-outside mx-5'}>
              <li
                className={
                  'text-text-black text-[12px] leading-[150%] tracking-[0.06px] mb-3'
                }
              >
                迷惑メールに振り分けられていたり、フィルターや転送設定によって受信ボックス以外の場所に保管されていないかご確認ください。
              </li>
              <li
                className={
                  'text-text-black text-[12px] leading-[150%] tracking-[0.06px] mb-3'
                }
              >
                メール送信に時間がかかる場合がございます。数分待った上で、メールが届いているか再度ご確認ください。
              </li>
              <li
                className={
                  'text-text-black text-[12px] leading-[150%] tracking-[0.06px] mb-1'
                }
              >
                ご使用のメールアドレスが正しいかどうか確認してください。正しくない場合はメールアドレスの再設定をお願いします。
              </li>
            </ul>
          </div>
          <div className={'w-[280px] mt-6'}>
            <Button onClick={handleClose}>ログイン画面に戻る</Button>
          </div>
          <p
            onClick={reSendResetPassword}
            className={
              'text-primary text-[16px] leading-[150%] tracking-[0.08px] mt-4 cursor-pointer'
            }
          >
            メールを再送信
          </p>
        </div>
      )}
    </Modal>
  );
}
