'use client';
import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/assets/icons';
import Image from 'next/image';
import { DetailOrdersProps } from '..';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import * as Orders from '@/app/api/entities/orders';
import * as Suppliers from '@/app/api/entities/suppliers';
import { useSession } from 'next-auth/react';
import TableListProductDetails, {
  TableListProductDetailsProps,
} from '../../TableListProductDetails';
import { Order, Supplier } from '@/app/types/entities';
import { useAppSelector } from '@/app/store';
import { selectMe } from '@/app/selectors/auth';
import { calculateTotalQuantityPerPack } from '@/app/utils/orders';
import { ORDER_STATUS_DIV } from '@/lib/constants';
import clsx from 'clsx';

interface ConfirmTabOrderReplyingDeliveryProps {
  cancelConfirm: any;
  confirm: any;
  orderDetail: Order;
}

export default function ConfirmTabOrderReplyingDelivery({
  orderDetail,
  cancelConfirm,
  confirm,
}: ConfirmTabOrderReplyingDeliveryProps) {
  const { getValues } = useFormContext();
  const { data: session } = useSession();

  const { data: me } = useAppSelector(selectMe);

  const handleSubmit = useCallback(async (event: any) => {
    try {
      event.preventDefault();
      const data: { deadlineDate: Date; action: 'Accept'; memo: string } = {
        deadlineDate: moment(getValues('deliveryDate')).toDate(),
        action: 'Accept',
        memo: getValues('remarks') || '',
      };

      const dataByStatus: { changeDeadline: Date; memo: string } = {
        changeDeadline: moment(getValues('deliveryDate')).toDate(),
        memo: getValues('remarks') || '',
      };

      if (
        orderDetail.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED ||
        orderDetail.statusDiv === ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST
      ) {
        await Orders.supplierValidateByStatus(
          orderDetail.id.toString(),
          dataByStatus,
          session?.user?.accessToken || '',
        );
      } else {
        await Orders.supplierValidationRequest(
          orderDetail.id.toString(),
          data,
          session?.user?.accessToken || '',
        );
      }
      confirm();
      // props.cancelConfirm;
    } catch (e) {
      alert('Error occurred');
      console.error(e);
    }
  }, []);

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

  const actions: {
    updatedAt: string;
    username: string;
    companyName: string;
    memo: string;
  }[] = useMemo(() => {

    const formattedActions = orderDetail.actions.map(action => ({
      updatedAt: moment(action.createdAt).format('yyyy年MM月DD日'),
      username: action.userName,
      companyName: action.companyName,
      memo: action.memo,
    }));

    formattedActions.unshift({
      updatedAt: moment().format('yyyy年MM月DD日'),
      companyName: me?.supplierName || '',
      memo: getValues('remarks') || '',
      username: me?.username || '',
    });

    return formattedActions;
  }, [orderDetail, me]);

  return (
    <div>
      <form>
        <div className="bg-card font-noto-sans-jp">
          <div className="text-[#222222] text-base font-normal leading-6 ml-[47px] pb-[12px]">
            以下の内容で回答しますか？
          </div>
          <div className="w-full flex">
            <div className="w-[calc(100%-300px)] pl-[27px]">
              <div className="w-full h-[56px] bg-[#F5F5F5] border-l-4 border-l-[#61876E] border-b border-b-[#3C6255]">
                <div
                  className="text-[#222222] text-xl font-bold h-[56px] leading-[56px] px-[14px]"
                  id="sectionTogo1"
                >
                  受注商品
                </div>
              </div>
              <div className="w-full overflow-y-auto max-h-[300px]  pr-[20px]">
                <TableListProductDetails products={listProducts} />
              </div>
              <div className="w-full h-[56px] bg-[#F5F5F5] border-l-4 border-l-[#61876E] border-b border-b-[#3C6255] mt-[25px]">
                <div
                  className="text-[#222222] text-xl font-bold h-[56px] leading-[56px] px-[14px]"
                  id="sectionTogo2"
                >
                  回答内容
                </div>
              </div>
              <div className="w-full pl-[20px]">
                <div className="w-full flex-col justify-start items-start inline-flex h-[37px] mt-[12px] border-b border-[#E1E7EB]">
                  <div className="flex h-6 text-[#6B6B6B] text-base font-bold leading-6">
                    <div className="w-[200px] mr-[66px]">納品回答日 </div>
                    <div className="">
                      {moment(getValues('deliveryDate')).format(
                        'yyyy年MM月DD日',
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[56px] bg-[#F5F5F5] border-l-4 border-l-[#61876E] border-b border-b-[#3C6255] mt-[25px]">
                <div
                  className="text-[#222222] text-xl font-bold h-[56px] leading-[56px] px-[14px]"
                  id="sectionTogo3"
                >
                  備考欄
                </div>
              </div>
              <div className="w-full overflow-y-auto max-h-[300px]">
                <div className="w-full flex justify-start items-start h-[37px] mt-[12px] border-b bg-[#F5F7F8] pl-[20px]">
                  <div className="w-[200px] h-[37px] text-[#222222] text-base font-bold leading-[37px]">
                    最終更新日時
                  </div>
                  <div className="w-[160px] h-[37px] text-[#222222] text-base font-bold leading-[37px]">
                    会社名
                  </div>
                  <div className="w-[160px] h-[37px] text-[#222222] text-base font-bold leading-[37px]">
                    ユーザー名
                  </div>
                  <div className="h-[37px] text-[#222222] text-base font-bold leading-[37px]">
                    備考
                  </div>
                </div>

                {actions.map((action, index) => (
                  <div
                    key={index}
                    className=" pl-[20px] w-full flex justify-start items-start  mt-[12px] border-b border-[#E1E7EB] "
                  >
                    <div className="flex  text-[#6B6B6B] text-base font-bold leading-6">
                      <div className="w-[200px]">{action.updatedAt}</div>
                    </div>
                    <div className="flex  text-[#6B6B6B] text-base font-bold leading-6">
                      <div className="w-[160px]">{action.companyName}</div>
                    </div>
                    <div className="flex  text-[#6B6B6B] text-base font-bold leading-6">
                      <div className="w-[160px]">{action.username}</div>
                    </div>
                    <div className="flex text-[#6B6B6B] ">
                      <p className="font-noto-sans-jp text-[16px] text-base font-bold leading-6 whitespace-pre-wrap">
                        {action.memo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[300px] ml-[14px]">
              <div className="w-[232px] h-fit pl-4 pr-4 pt-3 pb-3 mb-2 bg-white flex-col justify-start items-start inline-flex border border-[#CAD5DB]">
                <div className="text-[#222222] text-base font-bold leading-6">
                  目次
                </div>
                <div className="flex-col justify-start items-start flex">
                  <Link
                    href="#sectionTogo1"
                    className="h-[36px] justify-start items-start inline-flex border-b boerder-[#E1E7EB] cursor-pointer"
                  >
                    <Image
                      src={ICONS.AROW_SHOW_BLUE}
                      className="mx-auto"
                      width={32}
                      height={32}
                      alt={'itemName'}
                    />
                    <div className="w-40 self-stretch text-[#222222] text-base font-normal leading-[32px] h-[32px] ml-1">
                      受注商品
                    </div>
                  </Link>
                  <Link
                    href="#sectionTogo2"
                    className="h-[36px] justify-start items-start inline-flex border-b boerder-[#E1E7EB] cursor-pointer"
                  >
                    <Image
                      src={ICONS.AROW_SHOW_BLUE}
                      className="mx-auto"
                      width={32}
                      height={32}
                      alt={'itemName'}
                    />
                    <div className="w-40 self-stretch text-[#222222] text-base font-normal leading-[32px] h-[32px] ml-1">
                      回答内容
                    </div>
                  </Link>
                  <Link
                    href="#sectionTogo3"
                    className="h-[36px] justify-start items-start inline-flex cursor-pointer"
                  >
                    <Image
                      src={ICONS.AROW_SHOW_BLUE}
                      className="mx-auto"
                      width={32}
                      height={32}
                      alt={'itemName'}
                    />
                    <div className="w-40 self-stretch text-[#222222] text-base font-normal leading-[32px] h-[32px] ml-1">
                      備考欄
                    </div>
                  </Link>
                </div>
              </div>

              <div className="w-fit mx-auto mt-[7px]">
                <Button
                  onClick={handleSubmit}
                  className={clsx('!w-[232px] mr-[15px] mb-2', {
                    'bg-[#D3D3D3] cursor-not-allowed': ![2, 3, 4, 9].includes(
                      orderDetail.statusDiv,
                    ),
                  })}
                  disabled={![2, 3, 4, 9].includes(orderDetail.statusDiv)}
                >
                  決定
                </Button>
                <Button
                  onClick={cancelConfirm}
                  className="bg-transparent !text-primary border-[2px] border-primary border-solid  !w-[232px]"
                >
                  内容を修正
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card w-full h-[200px] mt-[33px] pt-[36px]">
          <div className="text-[#222222] text-xl font-bold w-fit mx-auto h-[29px] leading-[29px]">
            内容の確認後、決定ボタンを押してください
          </div>
          <div className="flex w-fit mx-auto mt-[7px]">
            <Button
              onClick={handleSubmit}
              className={clsx('!w-[280px] mr-[15px]', {
                'bg-[#D3D3D3] cursor-not-allowed': ![2, 3, 4, 9].includes(
                  orderDetail.statusDiv,
                ),
              })}
              disabled={![2, 3, 4, 9].includes(orderDetail.statusDiv)}
            >
              決定
            </Button>
            <Button
              onClick={cancelConfirm}
              className="bg-transparent !text-primary border-[2px] border-primary border-solid  !w-[280px]"
            >
              内容を修正
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
