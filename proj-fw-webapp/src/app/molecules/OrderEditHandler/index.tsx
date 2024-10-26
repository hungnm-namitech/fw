import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import * as Companies from '@/app/api/entities/companies';
import * as itemGroups from '@/app/api/entities/itemsGroups';
import * as DivValues from '@/app/api/entities/div-values';
import Loader from '@/app/components/Loader';
import { Tabs } from '@/app/components/Tabs';
import { OrderDetailForm } from '@/app/organisms/OrderDetailForm';
import { Order } from '@/app/types/entities';
import { ITEM_DISPLAY_DIV } from '@/lib/constants';
import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setNewEntryFormData } from '@/app/reducers/orders/newOrderFormValue';
import { selectNewEntryFormData } from '@/app/selectors/orders';
import { makePulldownInputId } from '@/app/utils/orders';
import { useRouter } from 'next/navigation';

interface OrderEditHandlerProps {
  accessToken: string;
  itemCd: string;
  flowId: string;
  companyId: string;
  tradingCompany: string;
  currentUserId: number;
  order?: Order;
}

export default function OrderEditHandler({
  accessToken,
  flowId,
  itemCd,
  companyId,
  tradingCompany,
  currentUserId,
  order,
}: OrderEditHandlerProps) {
  const router = useRouter();
  const { data: staffs, isLoading: isStaffsLoading } = useSWR(
    'all-staffs',
    useCallback(
      () => Companies.staffs(companyId.toString(), accessToken),
      [companyId, accessToken],
    ),
  );
  const { data: item, isLoading: isItemLoading } = useSWR(
    ['itemGroup', itemCd, flowId],
    useCallback(
      () => itemGroups.find(itemCd, flowId, accessToken),
      [itemCd, flowId, accessToken],
    ),
  );

  const { data: bases, isLoading: isBasesLoading } = useSWR(
    'all-bases',
    useCallback(
      () => Companies.bases(companyId.toString(), accessToken),
      [accessToken, companyId],
    ),
  );

  const { data: divValues, isLoading: isDivValuesLoading } = useSWR(
    'all-div-values',
    useCallback(() => DivValues.all(''), [accessToken]),
  );

  const [settingUpData, setSettingUpData] = useState(true);

  const savedData = useAppSelector(selectNewEntryFormData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (savedData) {
      setSettingUpData(false);
      return;
    }

    if (item) {
      const deliveryDate = order?.requestedDeadline
        ? new Date(order.requestedDeadline)
        : undefined;
      const location = order?.destinationId || undefined;
      const staffId = order?.staffId?.toString();
      const mixedLoadingFlag = order?.mixedLoadingFlag;
      const notice = order?.memo;
      const transportVehicle = order?.vehicleClassDiv || undefined;

      if (item.type === ITEM_DISPLAY_DIV.TABULAR) {
        const data: TabularNewEntry = {
          type: 'tabular',
          deliveryDate,
          location,
          manager: staffId,
          mixedLoadingFlag,
          notice,
          transportVehicle,
          items: {},
        };

        order?.productDetails.forEach(productDetail => {
          if (data.items)
            data.items[productDetail.productDetailCd] =
              productDetail.desireQuantity;
        });

        dispatch(setNewEntryFormData(data));

        setSettingUpData(false);
      }

      if (item.type === ITEM_DISPLAY_DIV.PULLDOWN) {
        const data: PulldownNewEntry = {
          type: 'pulldown',
          deliveryDate,
          location,
          manager: staffId,
          mixedLoadingFlag,
          notice,
          transportVehicle,
          products: {},
        };

        order?.productDetails.forEach(productDetail => {
          if (data.products) {
            data.products[makePulldownInputId(6)] = {
              desireQuantity: productDetail.desireQuantity.toString(),
              productId: productDetail.productCd,
              id: productDetail.productDetailCd.toString(),
            };
          }
        });

        dispatch(setNewEntryFormData(data));

        setSettingUpData(false);
      }
    }

    // return () => {
    //   dispatch(emptyNewEntryFormData());
    // };
  }, [order, item, dispatch]);

  if (
    isBasesLoading ||
    isItemLoading ||
    isDivValuesLoading ||
    isStaffsLoading
  ) {
    return <Loader />;
  }

  if (!bases || !divValues || !item || !staffs) {
    router.push('/404');
    return;
  }

  return (
    <>
      <div className="bg-white my-3 mx-5 ">
        <p className="text-3xl pt-[4px] font-bold leading-[125%] font-noto-sans-jp pb-2 border-b-[2px] border-solid border-border ml-[29px] mt-1 mr-[31px]">
          {item.itemName}の発注
        </p>
        <div className="m-auto ml-[209px] mr-[227px] mt-[44px] ">
          <Tabs
            tabs={[
              { label: '発注内容入力', value: 0 },
              { label: '発注内容確認', value: 1 },
              { label: '発注依頼完了', value: 2 },
            ]}
            value={0}
            tabClassName="w-[33.33%]"
          />
        </div>

        {!settingUpData && (
          <div className="mt-8">
            <OrderDetailForm
              companyId={companyId.toString()}
              currentUserId={currentUserId.toString()}
              accessToken={accessToken}
              bases={bases}
              staffs={staffs}
              item={item}
              divValues={divValues}
              itemGroupId={+itemCd}
              tradingCompany={tradingCompany}
              order={order}
              supplierCd={item.supplier.supplierCd}
            />
          </div>
        )}
      </div>
    </>
  );
}
