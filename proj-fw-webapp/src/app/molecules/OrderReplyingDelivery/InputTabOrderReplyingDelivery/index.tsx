'use client';

import { useRouter } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@/app/components/DatePicker';
import Textarea from '@/app/components/Textarea';
import { Button } from '@/app/components/Button';
import { createMessage } from '@/lib/utilities';
import MESSAGES from '@/lib/messages';
import { Order } from '@/app/types/entities';
import TableListProductDetails, {
  TableListProductDetailsProps,
} from '../../TableListProductDetails';
import { useMemo } from 'react';
import moment from 'moment';
import Yup from '@/app/yup.global';
import Link from 'next/link';
import { calculateTotalQuantityPerPack } from '@/app/utils/orders';
import clsx from 'clsx';

interface InputTabOrderReplyingDeliveryProps {
  onConfirm: any;
  orderDetail: Order;
}

export default function InputTabOrderReplyingDelivery({
  orderDetail,
  onConfirm,
}: InputTabOrderReplyingDeliveryProps) {
  const { formState, control, handleSubmit } = useFormContext();
  const router = useRouter();

  const onSubmit = (data: any) => {
    onConfirm();
  };
  const cancelOrder = () => {
    router.push('/orders');
  };

  const listProducts: TableListProductDetailsProps['products'] = useMemo(() => {
    const products: TableListProductDetailsProps['products'] = [
      {
        items: orderDetail.productDetails.map(pDetail => ({
          desireQuantity: pDetail.desireQuantity,
          gradeStrength: pDetail.gradeStrength,
          length: pDetail.length,
          productName: pDetail.productName,
          quantityPerPack: pDetail.quantityPerPack,
          thickness: pDetail.thickness,
          totalVolume: +(pDetail.itemVolume * pDetail.desireQuantity).toFixed(
            4,
          ),
          width: pDetail.width,
        })),
        productName: orderDetail.itemName,
        supplierName: orderDetail.supplierName,
        totalVolume: orderDetail.orderQuantity,
        totalQuantityPerPack: calculateTotalQuantityPerPack(
          orderDetail.productDetails,
        ),
      },
    ];

    return products;
  }, [orderDetail]);

  const desireDeliveryDate = useMemo(
    () => moment(orderDetail.requestedDeadline).format('YYYY/MM/DD'),
    [orderDetail],
  );

  return (
    <div>
      <form>
        <div className="bg-card">
          <div className="flex pt-[25px] pl-[152px] pr-[152px] justify-between">
            <div className="flex">
              <div className=" ustify-between  flex border-b border-[#393642]   pb-[8px] pr-[35px]">
                <p className="text-[#5B4C35] text-lg font-bold w-[200px] leading-[35px]">
                  顧客名
                </p>
                <p className="text-black text-3xl leading-[35px] font-bold">
                  {orderDetail.companyName || ''}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="justify-between flex border-b border-[#393642] min-w-[366px] pb-[8px] pr-[35px]">
                <p className="text-[#5B4C35] text-lg font-bold w-[200px] leading-[35px] ">
                  発注No．
                </p>
                <p className="text-black text-3xl leading-[35px] font-bold">
                  {(orderDetail.id || '').toString().padStart(5, '0')}
                </p>
              </div>
            </div>
          </div>
          <div className="pr-[29px]">
            <div className="w-full pl-[77px] mt-[58px]  pr-[49px] overflow-y-auto max-h-[350px]">
              <TableListProductDetails products={listProducts} />
            </div>
          </div>
          <div className="flex w-full pr-[141px] pl-[107px] justify-between mt-[129px]">
            <div className="flex">
              <div className="w-fit h-[68px] flex border-b border-[#393642] mt-[5px] ">
                <div className="text-[#5B4C35] text-lg font-bold w-[200px] leading-[68px]">
                  顧客希望納期
                </div>
                <div className="text-black text-2xl leading-[68px] font-bold">
                  {desireDeliveryDate}
                </div>
              </div>
            </div>
            <Controller
              control={control}
              name="deliveryDate"
              render={({ field, fieldState }) => (
                <DatePicker
                  onKeyDown={e => {
                    if (e.code !== 'Backspace') e.preventDefault();
                  }}
                  error={fieldState.error?.message}
                  label={'回答納期'}
                  labelClassName="leading-[22px] tracking-[-0.28px] !text-bold"
                  selected={field.value}
                  onChange={date => field.onChange(date)}
                  dateFormat={'yyyy/MM/dd'}
                  classname="w-[400px]"
                />
              )}
            />
          </div>
          <div className="w-full pr-[141px] pl-[107px] mt-[49px] pb-[118px]">
            <Controller
              control={control}
              name="remarks"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  error={fieldState.error?.message}
                  label={'備考欄'}
                  className="w-full min-h-[102px] !resize-y"
                />
              )}
            />
          </div>
        </div>
        <div className="bg-card w-full h-[200px] mt-[33px] pt-[36px]">
          <div className="text-[#222222] text-xl font-bold w-fit mx-auto h-[29px] leading-[29px]">
            内容の確認後、決定ボタンを押してください
          </div>
          <div className="flex w-fit mx-auto mt-[7px]">
            <Button
              disabled={
                !Object.keys(formState.errors) ||
                ![2, 3, 4, 9].includes(orderDetail.statusDiv)
              }
              onClick={handleSubmit(onSubmit)}
              className={clsx('!w-[280px] mr-[15px]', {
                'bg-[#D3D3D3] cursor-not-allowed':
                  !Object.keys(formState.errors) ||
                  ![2, 3, 4, 9].includes(orderDetail.statusDiv),
              })}
            >
              決定
            </Button>
            <Link
              href={'/orders'}
              onClick={cancelOrder}
              className="bg-transparent font-bold text-[16px] rounded-[4px] pt-[16px] pb-[18px] leading-[22px] tracking-[1.4px] font-noto-sans-jp text-center !text-primary border-[2px] border-primary border-solid  !w-[280px]"
            >
              戻る
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
