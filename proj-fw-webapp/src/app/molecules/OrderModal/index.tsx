import { Button } from '@/app/components/Button';
import { Modal } from '@/app/components/Modal';
import Textarea from '@/app/components/Textarea';
import MESSAGES from '@/lib/messages';
import { createMessage } from '@/lib/utilities';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as Orders from '@/app/api/entities/orders';
import clsx from 'clsx';
import { USER_ROLE } from '@/lib/constants';

interface OrderModal {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  requestNote: string;
  placeholder: string;
  onSubmit: (data: AprovalForm) => void;
  classNameTitle?: string;
  classNameRqNode?: string;
}

export interface AprovalForm {
  memo: string;
}

const OrderModal = ({
  open,
  onClose,
  title,
  placeholder,
  requestNote,
  classNameTitle,
  onSubmit,
  classNameRqNode,
}: OrderModal) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AprovalForm>({
    defaultValues: {
      memo: '',
    },
  });
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        className={
          'flex flex-col items-center w-[695px] h-[416px] pt-[59px] pb-[55px] px-[48px] !font-noto-sans-jp'
        }
      >
        <p
          className={clsx(
            'text-text-black text-center text-[24px] font-bold leading-[125%] mb-[35px]',
            classNameTitle,
          )}
        >
          {title}
        </p>
        <p
          className={clsx(
            'text-[#C53F3F] text-[14px] leading-2 tracking-[0.07px] text-center mb-6',
            classNameRqNode,
          )}
        >
          {requestNote}
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textarea
            {...register('memo', {
              maxLength: {
                value: 2000,
                message: MESSAGES.MAX_LENGTH_MEMO,
              },
            })}
            className="!w-[411.454px] resize "
            placeholder={placeholder}
            error={errors?.memo?.message?.toString()}
          />
          <div className="flex gap-4 mt-[55.98px]">
            <div className={'w-[192px]'}>
              <Button type="submit">登録する</Button>
            </div>
            <div className={'w-[192px]'}>
              <Button
                className="bg-white border border-[#000] !text-[#222222]"
                type="reset"
                onClick={handleClose}
              >
                戻る
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OrderModal;
