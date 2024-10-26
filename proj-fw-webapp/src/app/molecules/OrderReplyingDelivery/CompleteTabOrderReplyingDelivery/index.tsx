'use client';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import Image from 'next/image';
import { DetailOrdersProps } from '..';
import Link from 'next/link';

interface CompleteTabOrderReplyingDeliveryProps {
  cancelConfirm: any;
  confirm: any;
}

export default function CompleteTabOrderReplyingDelivery(
  props: CompleteTabOrderReplyingDeliveryProps,
) {
  return (
    <div className="bg-card flex items-center flex-col justify-center pt-[80px] h-[calc(100vh-300px)]">
      <Image src={ICONS.WOOD_LARGE_ICON} alt="Wood" height="190" />

      <p className="font-noto-sans-jp text-4xl font-bold leading-[125%] text-text-black mt-[39px]">
        登録が完了しました
      </p>

      <Link
        href={'/orders'}
        className=" mt-[40px] font-noto-sans-jp text-md font-bold leading-[125%]  text-center w-[360px] rounded-[4px] py-[17px] shadow-sm px-[20px] bg-primary text-dark-primary-contrast "
      >
        一覧に戻る
      </Link>
    </div>
  );
}
