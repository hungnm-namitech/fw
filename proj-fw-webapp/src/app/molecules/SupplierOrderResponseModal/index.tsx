'use client';

import { Button } from '@/app/components/Button';
import { Modal } from '@/app/components/Modal';
import Textarea from '@/app/components/Textarea';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Orders from '@/app/api/entities/orders';
import { useSession } from 'next-auth/react';

interface SupplierOrderResponseModalProps {
  open: boolean;
  handleClose: () => void;
  selected: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSelected: React.Dispatch<
    React.SetStateAction<{
      [k: string]: boolean;
    }>
  >;
}

export default function SupplierOrderResponseModal({
  handleClose,
  open,
  selected,
  setCurrentPage,
  setSelected,
}: SupplierOrderResponseModalProps) {
  const form = useForm<{ memo: string }>({ defaultValues: { memo: '' } });
  const { data: session } = useSession();

  const submit = async (data: { memo: string }) => {
    var jsonObject = selected;
    var orderIds = [];
    for (var key in jsonObject) {
      if (jsonObject[key] === true) {
        orderIds.push(parseInt(key));
      }
    }
    await Orders.batchUpdateReplyDeadline(
      data.memo,
      orderIds,
      session?.user?.accessToken || '',
    );
    setCurrentPage(0);
    setSelected({});
    handleClose();
  };

  return (
    <Modal onClose={handleClose} open={open}>
      <form>
        <div className="min-w-[695px] mt-[57px] mb-[55px]">
          <p className="font-noto-sans-jp font-bold leading-[125%] text-[24px] text-text-black text-center whitespace-pre-wrap">
            納期を回答します。 <br />
            よろしいですか？
          </p>

          <div className="mt-[49px] w-[59.2805%] m-auto">
            <Controller
              control={form.control}
              name="memo"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  error={fieldState.error?.message}
                  className=" m-auto min-h-[81px] resize-y"
                ></Textarea>
              )}
            />
          </div>
          <div className="mt-[56px] flex items-center justify-center gap-[16px] flex-wrap">
            <Button
              type="submit"
              onClick={form.handleSubmit(submit)}
              className="!w-[27.6258%]"
            >
              登録する
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="!w-[27.6258%] h-full !bg-transparent border-[1px] !text-text-black border-solid border-[#000] font-bold leading-[22px] tracking-[1.4px] font-noto-sans-jp text-center text-[16px]"
            >
              戻る
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
