import { Button } from '@/app/components/Button';
import { Modal } from '@/app/components/Modal';
import { useState } from 'react';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  handleDelete: () => void;
  title?: string;
}

export default function DeleteModal({
  open,
  onClose,
  handleDelete,
  title = '田中太郎　を削除しますか？',
}: DeleteModalProps) {
  const handleClose = () => {
    onClose();
  };
  return (
    <Modal
      open={open}
      linkIcon="/close-icon-delete.svg"
      className="rounded-[8px]"
      classNameIcon="!w-[32px] top-[7px] right-[7px]"
      onClose={handleClose}
    >
      <div
        className={
          'flex flex-col w-[480px] pt-[32px] pb-[24px] px-[32px] !font-noto-sans-jp'
        }
      >
        <p
          className={
            'text-text-black text-[20px] font-bold leading-[125%] mb-[20px]'
          }
        >
          {title}
        </p>
        <p
          className={
            'text-text-black text-[16px] leading-[125%] font-medium mb-6'
          }
        >
          マスタ上から削除すると、登録されている過去のデータからも参照できなくなります。
        </p>

        <div className="flex justify-end gap-[16px]">
          <Button
            className="!w-fit h-[36px] bg-transparent !text-[#002B53] !border-[1px] border-[#002B53] border-solid !min-h-[36px] justify-center items-center inline-flex"
            onClick={handleClose}
          >
            キャンセル
          </Button>
          <Button
            className="!w-fit h-[36px] !min-h-[36px] justify-center items-center inline-flex !bg-[#C53F3F]"
            onClick={handleDelete}
          >
            削除
          </Button>
        </div>
      </div>
    </Modal>
  );
}
