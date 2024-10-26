'use client';
import * as Orders from '@/app/api/entities/orders';
import { ICONS } from '@/app/assets/icons';
import { Button } from '@/app/components/Button';
import { Modal } from '@/app/components/Modal';
import TableOfContents from '@/app/components/TableOfContents';
import { PAGES } from '@/app/constants/common.const';
import { ListOrderDetail, RequestDetails } from '@/app/types/entities';
import {
  checkActiveApprovalOrdDetail,
  checkActiveRejectionOrdDetail,
  checkActiveDelOrdDetail,
  warningReply,
} from '@/app/utils/orders';
import { ORDER_STATUS_DIV, USER_ROLE } from '@/lib/constants';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import useSWR from 'swr';
import ButtonGroup from '../ButtonGroup';
import OrderModal, { AprovalForm } from '../OrderModal';
import OrderStatus from '../OrderStatus';
import {
  ChangeLog,
  OrderProduct,
  RemarksColumn,
  RequestDetail,
} from '../OrderTable';
import Image from 'next/image';
import Loader from '@/app/components/Loader';

interface OrderDetailsContentProps {
  session: string;
  role: USER_ROLE;
}

interface DuplicateOrder {
  itemDetails: { itemDetailId: string; quantity: number }[];
  requestedDeadline: string | null;
  customerId: number;
  mixedLoadingFlag: boolean;
  vehicleClassDiv: string;
  destinationId: number;
  memo: string;
  temporalyFlag: boolean;
  tradingCompany: string | null;
  supplierCd: string | null;
  itemCd: string | null;
}

export default function OrderDetailsContent({
  session,
  role,
}: OrderDetailsContentProps) {
  const router = useRouter();
  const { orderId } = useParams();
  const [isModalTrouble, setIsModalTrouble] = useState(false);
  const [isModalSchedule, setIsModalSchedule] = useState(false);
  const [isAprovalOrder, setIsAprovalOrder] = useState(false);
  const [isRejectOrder, setIsRejectOrder] = useState(false);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [isChangeOrder, setIsChangeOrder] = useState(false);
  const [requestDetails, setRequestDetails] = useState<RequestDetails>();
  const [duplicateOrder, setDuplicateOrder] = useState<DuplicateOrder>({
    customerId: 0,
    destinationId: 0,
    memo: '',
    temporalyFlag: false,
    itemDetails: [{ itemDetailId: '', quantity: 0 }],
    mixedLoadingFlag: false,
    vehicleClassDiv: '',
    requestedDeadline: '',
    tradingCompany: '',
    supplierCd: '',
    itemCd: '',
  });
  const [showShippingDetail, setShowShippingDetail] = useState(false);
  const {
    data: orderDetails,
    mutate,
    isLoading: isOrderDetailLoading,
  } = useSWR(
    ['order-details', orderId, session],
    () => Orders.getOrderDetail(session, orderId as string),
    {
      onError: err => {
        if (err) {
          router.push('/404');
          return;
        }
      },
    },
  );
  const isDraft = useMemo(() => {
    return orderDetails?.temporalyFlag;
  }, [orderDetails?.temporalyFlag]);

  useSetModalSchedule(
    role,
    isOrderDetailLoading,
    orderDetails,
    setIsModalSchedule,
  );

  const dataTableOfContents = [
    {
      id: 'order-product-list',
      content: '発注商品',
    },
    {
      id: 'request-details-list',
      content: '依頼内容',
    },
    {
      id: 'change-log-list',
      content: '更新履歴',
    },
    {
      id: 'remarks-column-list',
      content: '備考欄',
    },
  ];

  const titleQues = (userRole: USER_ROLE) => {
    switch (userRole) {
      case USER_ROLE.PC:
        return '';
      case USER_ROLE.SUPPLIER: {
        if (
          orderDetails?.statusDiv === ORDER_STATUS_DIV.CANCELLATION_APPROVED
        ) {
          return '以下の発注内容がキャンセルされました。承認しますか？';
        } else if (
          orderDetails?.statusDiv ===
          ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED
        ) {
          return '以下の発注内容を承認しますか？';
        } else return '';
      }
      default: {
        if (orderDetails?.statusDiv === ORDER_STATUS_DIV.CANCELLATION_REQUEST) {
          return '以下の発注内容がキャンセルされました。承認しますか？';
        } else if (
          orderDetails?.statusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM ||
          orderDetails?.statusDiv ===
            ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST ||
          orderDetails?.statusDiv === ORDER_STATUS_DIV.CHANGE_REQUEST
        ) {
          return '以下の発注内容を承認しますか？';
        } else return '';
      }
    }
  };
  const handleMoveTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // role PC
  const handleDuplicateOrder = async () => {
    try {
      await Orders.save(duplicateOrder, session);
      alert('発注複製は成功しました。');
    } catch (error) {
      console.error(error);
      alert('Error occurred!');
    }
  };

  //roleFW
  const handleApprovalOrder: SubmitHandler<AprovalForm> = async data => {
    if (role === USER_ROLE.FW || role === USER_ROLE.ADMIN) {
      try {
        await Orders.aprrovalOrderByFW(data.memo, +orderId, session);
        setIsAprovalOrder(false);
        await mutate();
        alert('発注承認は成功しました。');
      } catch (error) {
        console.error(error);
      }
    }
    if (
      role === USER_ROLE.SUPPLIER &&
      orderDetails?.statusDiv === ORDER_STATUS_DIV.CANCELLATION_APPROVED
    ) {
      try {
        await Orders.aprrovalOrderBySub(data.memo, +orderId, session);
        setIsAprovalOrder(false);
        await mutate();
        alert('発注承認は成功しました。');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRefusalOrder: SubmitHandler<AprovalForm> = async data => {
    if (role === USER_ROLE.PC) {
      try {
        //rolePC
        await Orders.cancelOrderByPC(
          {
            statusDiv: ORDER_STATUS_DIV.CANCELLATION_REQUEST.toString(),
            memo: data.memo,
            temporaryFlag: orderDetails?.temporalyFlag,
          },
          +orderId,
          session,
        );
        if (orderDetails?.actions.length === 0) {
          router.push(PAGES.ORDERS);
        } else {
          await mutate();
        }
        alert('キャンセルは成功されました。');
      } catch (error) {
        console.error(error);
      }
    } else if (
      role === USER_ROLE.SUPPLIER &&
      orderDetails?.statusDiv !== ORDER_STATUS_DIV.DELIVERED
    ) {
      //role Supplier
      try {
        await Orders.refusalOrderBySub(data.memo, +orderId, session);
        await mutate();
        alert('発注否決は成功しました。');
        router.push(PAGES.ORDERS);
      } catch (error) {
        console.error(error);
      }
    } else {
      //roleFW
      try {
        await Orders.refusalOrderByFW(data.memo, +orderId, session);
        await mutate();
        alert('発注否決は成功しました。');
        router.push(PAGES.ORDERS);
      } catch (error) {
        console.error(error);
      }
    }
    setIsRejectOrder(false);
  };

  useSetDuplicateOrder(
    orderDetails,
    setDuplicateOrder,
    orderDetails?.supplierCd,
  );

  useSetRequestDetails(setRequestDetails, orderDetails);

  const handleBtn1NotPC = () => {
    if (
      ((role === USER_ROLE.FW || role === USER_ROLE.ADMIN) &&
        orderDetails &&
        checkActiveApprovalOrdDetail(orderDetails.statusDiv, role)) ||
      (role === USER_ROLE.SUPPLIER &&
        orderDetails?.statusDiv === ORDER_STATUS_DIV.CANCELLATION_APPROVED)
    )
      setIsAprovalOrder(true);
    if (
      role === USER_ROLE.SUPPLIER &&
      orderDetails?.statusDiv ===
        ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED
    ) {
      router.push(
        `${PAGES.ORDERS}/${orderDetails.id}/${PAGES.ORDERS_REPLY_DELIVERY}`,
      );
    }
  };
  const handleBtn2NotPC = () => {
    if (
      orderDetails &&
      checkActiveRejectionOrdDetail(orderDetails.statusDiv, role)
    )
      setIsRejectOrder(true);
  };
  const handleBtn3NotPC = () => {
    router.push(PAGES.ORDERS);
  };

  const handleDeliveryState = async () => {
    try {
      await Orders.doDeliveryState(+orderId, session);
      await mutate();
      alert('受領登録が成功されました。');
      setIsModalSchedule(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <div className="bg-card flex flex-col">
        <div className="w-full mt-[28px] pr-[21px] pl-[27px] mb-[13px] flex justify-between items-center">
          <div className="text-gray-900 font-bold leading-[30px] text-[24px]">
            {role !== USER_ROLE.PC ? '発注内容確認' : '発注詳細'}
          </div>
          {orderDetails?.statusDiv && role && (
            <OrderStatus
              type={role}
              statusDiv={orderDetails?.statusDiv}
              size="lg"
            />
          )}
        </div>
        <div className="w-full h-[2px] pr-[21px] pl-[27px]">
          <div className="w-full h-full bg-[#CAD5DB]"></div>
        </div>
        <div className="mt-[25px] mr-[35px] ml-[27px]">
          {orderDetails && (
            <div
              className={clsx('ml-[47px]', {
                'text-[#CB0A29] font-bold':
                  orderDetails.statusDiv ===
                    ORDER_STATUS_DIV.CANCELLATION_APPROVED ||
                  orderDetails.statusDiv ===
                    ORDER_STATUS_DIV.CANCELLATION_REQUEST,
              })}
            >
              {role && titleQues(role)}
            </div>
          )}
          <div
            className={clsx('mt-[12px] flex pb-[136px]', {
              'gap-[2%]': role !== USER_ROLE.PC,
              'gap-[3.076923%]': role === USER_ROLE.PC,
            })}
          >
            <div
              className={clsx({
                'w-[79.1599%]': role !== USER_ROLE.PC,
                'w-[75.3846%]': role === USER_ROLE.PC,
              })}
            >
              {!!orderDetails?.productDetails && (
                <OrderProduct
                  products={orderDetails.productDetails}
                  itemName={orderDetails.itemGroupName}
                  orderQuantity={orderDetails.orderQuantity}
                  supplierName={orderDetails.supplierName}
                />
              )}
              <RequestDetail
                requestDetails={requestDetails}
                handleShippingDetail={() => setShowShippingDetail(true)}
              />
              <ChangeLog logs={orderDetails?.actions} />
              <RemarksColumn marks={orderDetails?.actions} />
            </div>
            <div className="flex-1">
              <div className="sticky top-[50px]">
                <TableOfContents
                  dataTable={dataTableOfContents}
                  handleMoveTo={handleMoveTo}
                />
                <div className="mt-[18px] mx-auto text-center text-[14px] font-noto-sans-jp leading-[21px]">
                  <p>内容の確認後</p>
                  <p>ボタンを押してください</p>
                </div>
                {role === USER_ROLE.PC ? (
                  <ButtonGroup
                    btn1="同じ発注を複製する"
                    btn2="発注内容の変更"
                    btn3="注文キャンセル"
                    statusDiv={orderDetails?.statusDiv}
                    classWrapBtn="flex-col mt-[18px] gap-[10px]"
                    className1="bg-transparent text-primary border-[2px] border-primary"
                    className2="bg-transparent text-primary border-[2px] border-primary"
                    handleBtn1={() => {
                      if (
                        orderDetails &&
                        checkActiveApprovalOrdDetail(
                          orderDetails.statusDiv,
                          role,
                        )
                      )
                        router.push(
                          `${PAGES.ORDER_CREATE}?orderId=${orderDetails?.id}`,
                        );
                    }}
                    handleBtn2={() => {
                      if (
                        orderDetails &&
                        checkActiveRejectionOrdDetail(
                          orderDetails.statusDiv,
                          role,
                        )
                      )
                        router.push(`${PAGES.ORDERS}/${orderDetails?.id}/edit`);
                    }}
                    handleBtn3={() => {
                      if (
                        orderDetails &&
                        checkActiveDelOrdDetail(orderDetails.statusDiv, role)
                      )
                        setIsRejectOrder(false);
                        setIsCancelOrderModalOpen(true);
                    }}
                    iconTrash={ICONS.TRASH}
                    role={role}
                    isDraft={isDraft}
                  />
                ) : (
                  <ButtonGroup
                    btn1="承認する"
                    btn2="否決する"
                    btn3="戻る"
                    classWrapBtn="flex-col mt-[18px] gap-[10px]"
                    className2="bg-[#cb0a29]"
                    className3="bg-transparent !text-primary border-[2px] border-primary"
                    handleBtn1={handleBtn1NotPC}
                    handleBtn2={handleBtn2NotPC}
                    handleBtn3={handleBtn3NotPC}
                    statusDiv={orderDetails?.statusDiv}
                    role={role}
                    isDraft={isDraft}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card mt-[42px] min-h-[200px] flex justify-center items-center">
        {role === USER_ROLE.PC ? (
          <ButtonGroup
            btn1="注文内容の変更"
            btn2="同じ注文を複製する"
            btn3="注文キャンセル"
            classWrapBtn="gap-[15px] items-center justify-end mr-[55px]"
            className1="max-w-[280px]"
            className2="bg-transparent max-w-[280px] border-[2px] border-primary !text-primary"
            className3="ml-[70px] max-w-[280px]"
            isBtnBottom={true}
            handleBtn1={() => {
              if (
                orderDetails &&
                checkActiveRejectionOrdDetail(orderDetails.statusDiv, role)
              )
                router.push(`${PAGES.ORDERS}/${orderDetails?.id}/edit`);
            }}
            handleBtn2={() => {
              if (
                orderDetails &&
                checkActiveApprovalOrdDetail(orderDetails.statusDiv, role)
              )
                router.push(
                  `${PAGES.ORDER_CREATE}?orderId=${orderDetails?.id}`,
                );
            }}
            handleBtn3={() => {
              if (
                orderDetails &&
                checkActiveDelOrdDetail(orderDetails.statusDiv, role)
              )
                setIsRejectOrder(true);
            }}
            iconTrash={ICONS.TRASH}
            statusDiv={orderDetails?.statusDiv}
            role={role}
            isDraft={isDraft}
          />
        ) : (
          <ButtonGroup
            btn1="承認する"
            btn2="否決する"
            btn3="戻る"
            classWrapBtn="gap-[15px] items-center justify-center"
            className1="max-w-[280px]"
            className2="bg-[#cb0a29] max-w-[280px]"
            className3="bg-transparent !text-primary border-[2px] border-primary max-w-[280px]"
            isBtnBottom={true}
            handleBtn1={handleBtn1NotPC}
            handleBtn2={handleBtn2NotPC}
            handleBtn3={handleBtn3NotPC}
            statusDiv={orderDetails?.statusDiv}
            role={role}
            isDraft={isDraft}
          />
        )}
      </div>
      <OrderModal
        title="発注内容を承認します"
        requestNote="コメントを残す場合はメモに登録"
        placeholder="メモをする場合は入力します。"
        open={isAprovalOrder}
        onClose={() => setIsAprovalOrder(false)}
        onSubmit={handleApprovalOrder}
      />
      <OrderModal
        title="発注内容を変更します。よろしいですか？"
        classNameTitle="max-w-[280px] text-center !mb-[16px]"
        classNameRqNode="!mb-[12px] font-normal"
        requestNote="変更理由を残す場合はメモに登録"
        placeholder="発注可能枠が超過しています。変更をお願いします。"
        open={isChangeOrder}
        onClose={() => setIsChangeOrder(false)}
        onSubmit={handleRefusalOrder}
      />
      <OrderModal
        title="発注を否決します。"
        requestNote="否決理由を残す場合はメモに登録"
        placeholder="発注可能枠が超過しています。変更をお願いします。"
        open={isRejectOrder}
        onClose={() => setIsRejectOrder(false)}
        onSubmit={handleRefusalOrder}
      />
      <OrderModal
         title="この発注をキャンセルします。"
          requestNote="本当にキャンセルしますか？"
          placeholder="キャンセル理由"
          open={isCancelOrderModalOpen}
          onClose={() => setIsCancelOrderModalOpen(false)}
          onSubmit={handleRefusalOrder}
      />
      <Modal
        className="w-[695px] min-h-[185px] !outline-none"
        onClose={() => setShowShippingDetail(false)}
        open={showShippingDetail}
      >
        <div className="mt-10 ml-[31px] mr-[29px]">
          <table className="w-full">
            <thead>
              <tr>
                <td className="min-w-[140px] pb-[21px] pt-2 border-b-[1px] border-solid border-border font-bold text-md leading-2 tracking-[0.08px] font-noto-sans-jp">
                  電話番号
                </td>
                <td className="pb-[21px] pt-2 border-b-[1px] border-solid border-border text-sm font-noto-sans-jp tracking-[0.07px] leading-[22px] text-text-black">
                  {orderDetails?.baseTelNumber}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="min-w-[140px] pb-[21px] pt-2 border-b-[1px] border-solid border-border font-bold text-md leading-2 tracking-[0.08px] font-noto-sans-jp">
                  住所１
                </td>
                <td className="pb-[21px] pt-2 border-b-[1px] border-solid border-border text-sm font-noto-sans-jp tracking-[0.07px] leading-[22px] text-text-black">
                  {orderDetails?.baseAddress1}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
      <Modal
        className="w-[695px] h-[416px] !outline-none"
        onClose={() => setIsModalSchedule(false)}
        open={isModalSchedule}
      >
        <div className="text-center mr-[29px]">
          <div className="text-3xl font-bold leading-[30px] mt-[125px]">
            <p>納品予定日を過ぎましたが、納品済になっっていません。</p>
            <p>この明細の内容を受領しましたか？</p>
          </div>
          <div className="flex gap-4 justify-center mt-[120px]">
            <Button onClick={handleDeliveryState} className=" max-w-[192px]">
              はい
            </Button>
            <Button
              onClick={() => {
                setIsModalSchedule(false);
                setIsModalTrouble(true);
              }}
              className="bg-transparent text-black border-[1px] border-black rounded-1 max-w-[192px]"
            >
              いいえ
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        className="w-[695px] h-[416px] !outline-none"
        onClose={() => setIsModalTrouble(false)}
        open={isModalTrouble}
      >
        <div className="flex flex-col mr-[29px] items-center">
          <p className="text-3xl font-bold leading-[30px] mt-[125px]">
            納品予定日を過ぎましたが、納品済になっっていません。
          </p>
          <div className="bg-[#F5F7F8] w-[505px] py-3 flex flex-col items-center mt-9">
            <div className="flex text-center gap-1">
              <Image
                width={18}
                height={18}
                alt="phone number"
                src={ICONS.PHONE}
              />
              <p>03-1234-5678</p>
            </div>
            <p className="leading-[18px] font-normal text-xs tracking-[0.06px]">
              ファーストウッド株式会社
            </p>
          </div>
          <Button
            onClick={() => setIsModalTrouble(false)}
            className="bg-transparent border-[1px] border-[#000] rounded-1 text-black min-w-[192px] max-w-[53px] mt-[53px]"
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function useSetModalSchedule(
  role: USER_ROLE,
  isOrderDetailLoading: boolean,
  orderDetails: ListOrderDetail | undefined,
  setIsModalSchedule: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    if (isOrderDetailLoading) return undefined;
    const showScheduleModal =
      !!orderDetails?.replyDeadline &&
      warningReply(orderDetails?.replyDeadline, orderDetails?.statusDiv, role);
    setIsModalSchedule(showScheduleModal);
    return () => setIsModalSchedule(false);
  }, [orderDetails, isOrderDetailLoading]);
}

function useSetRequestDetails(
  setRequestDetails: Dispatch<SetStateAction<RequestDetails | undefined>>,
  orderDetails: ListOrderDetail | undefined,
) {
  useEffect(() => {
    setRequestDetails({
      requestDeadline: orderDetails?.requestedDeadline || '',
      replyDeadline: orderDetails?.replyDeadline || '',
      baseName: orderDetails?.baseName || '',
      tradingCompany: orderDetails?.tradingCompany || '',
      combinedPile: orderDetails?.mixedLoadingFlag || false,
      totalCubicMeter: orderDetails?.orderQuantity || 0,
      vehicleClassDiv: orderDetails?.vehicleClassDiv || '',
    });
  }, [orderDetails]);
}

function useSetDuplicateOrder(
  orderDetails: ListOrderDetail | undefined,
  setDuplicateOrder: Dispatch<SetStateAction<DuplicateOrder>>,
  supplierCd: string | undefined,
) {
  useEffect(() => {
    const itemDetails = orderDetails?.itemDetails.map(item => ({
      itemDetailId: item.productDetailCd,
      quantity: item.desireQuantity || 0,
    }));
    setDuplicateOrder({
      customerId: +(orderDetails?.staffId || ''),
      destinationId: +(orderDetails?.destinationId || ''),
      memo: orderDetails?.memo || '',
      temporalyFlag: orderDetails?.temporalyFlag || false,
      itemDetails: itemDetails || [],
      mixedLoadingFlag: orderDetails?.mixedLoadingFlag || false,
      vehicleClassDiv: orderDetails?.vehicleClassDiv || '',
      requestedDeadline: orderDetails?.requestedDeadline || null,
      tradingCompany: orderDetails?.tradingCompany || null,
      supplierCd: supplierCd || null,
      itemCd: orderDetails?.itemCd || null,
    });
  }, [orderDetails]);
}
