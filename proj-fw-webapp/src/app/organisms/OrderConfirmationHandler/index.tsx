import { Button } from '@/app/components/Button';
import PageHeader from '@/app/components/PageHeader';
import { Tabs } from '@/app/components/Tabs';
import OrderDetailSection from '@/app/molecules/OrderDetailSection';
import OrderRemarkSection from '@/app/molecules/OrderRemarkSection';
import { OrderedProductSection } from '@/app/molecules/OrderedProductSection';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import * as Companies from '@/app/api/entities/companies';
import * as itemGroups from '@/app/api/entities/itemsGroups';
import * as DivValues from '@/app/api/entities/div-values';
import * as Orders from '@/app/api/entities/orders';
import { ItemDetail } from '@/app/types/api-response';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/app/components/Loader';
import { selectNewEntryFormData } from '@/app/selectors/orders';
import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { useAppSelector } from '@/app/store';
import {
  calculateOrderVolumne,
  calculateTotalQuantityPerPack,
  formatItemDetails,
} from '@/app/utils/orders';
import { Order } from '@/app/types/entities';

interface OrderConfirmationHandlerProps {
  accessToken: string;
  companyId: string;
  flowId: string;
  username: string;
  itemGroupId: string;
  tradingCompany: string;
  order?: Order;
}

declare type FormDataType = {
  items: {
    [productId: string]: {
      id: string | undefined;
      desireQuantity: string;
    }[];
  };
} & (Omit<TabularNewEntry, 'items'> | PulldownNewEntry);

export default function OrderConfirmationHandler({
  accessToken,
  companyId,
  flowId,
  username,
  itemGroupId,
  tradingCompany,
  order,
}: OrderConfirmationHandlerProps) {
  const router = useRouter();
  const searchParms = useSearchParams();

  const { data: itemGroup, isLoading: isItemLoading } = useSWR(
    ['itemGroupDetail', itemGroupId, flowId, accessToken],
    useCallback(
      () => itemGroups.find(itemGroupId, flowId, accessToken),
      [itemGroupId, flowId, accessToken],
    ),
  );

  const { data: companies, isLoading: companiesLoading } = useSWR(
    'all-companies',
    useCallback(() => Companies.all(accessToken), [accessToken]),
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

  const data = useAppSelector(selectNewEntryFormData);

  const [isInvalidFormat, setIsInValidFormat] = useState(false);
  const [formData, setFormData] = useState<null | FormDataType>(null);

  const isDraft = useMemo(() => {
    return order?.temporalyFlag;
  }, [order?.temporalyFlag]);

  useEffect(() => {
    if (data) {
      if (data.type === 'pulldown') {
        const products = convertProductsFromPullDown(data);

        setFormData({ ...data, items: products });
      }
      if (data.type === 'tabular') {
        const products = convertProductsFromTabular(data, itemGroupId);

        setFormData({ ...data, items: products });
      }
      setIsInValidFormat(false);
    } else {
      router.push(`/orders/${order?.id}/edit?` + searchParms.toString());
      return;
    }
  }, [data, order]);

  if (
    isBasesLoading ||
    isItemLoading ||
    isDivValuesLoading ||
    companiesLoading
  ) {
    return <Loader />;
  }

  if (!bases || !divValues || !itemGroup || !companies) {
    router.push('/404');
    return;
  }

  const moveTo = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedBase = bases.find(
    base => base.id === +(formData?.location || ''),
  );
  const selectedDiv = divValues.find(
    div =>
      div.divValue === (formData?.transportVehicle || '').trim().toString(),
  );

  const selectedCompany = companies.find(company => company.id === companyId);

  const listProducts: {
    productName: string;
    totalVolume: number;
    supplierName: string;
    totalQuantityPerPack: number;
    items: (ItemDetail & { desireQuantity: number; totalVolume: number })[];
  }[] = (() => {
    if (!formData) return [];
    const productMaps: { [id: string]: ItemDetail } = {};
    itemGroup.itemDetails.forEach(itemDetail => {
      productMaps[itemDetail.id] = itemDetail;
    });

    const resut: {
      [id: string]: {
        productName: string;
        totalVolume: number;
        totalQuantityPerPack: number;
        supplierName: string;
        totalPrice: number;
        items: (ItemDetail & { desireQuantity: number; totalVolume: number })[];
      };
    } = {};

    Object.keys(formData.items).forEach(key => {
      if (key) {
        const items = formData.items[key];
        items.forEach(item => {
          const itemDetail = productMaps[item.id || ''];
          if (!resut[key])
            resut[key] = {
              productName: itemDetail.productName,
              items: [],
              totalVolume: 0,
              supplierName: itemGroup.supplier.supplierName,
              totalPrice: 0,
              totalQuantityPerPack: 0,
            };

          resut[key].items.push({
            ...itemDetail,
            desireQuantity: +item.desireQuantity,
            totalVolume: calculateOrderVolumne(
              itemDetail.itemVolume,
              +item.desireQuantity,
            ),
          });
        });

        resut[key].totalQuantityPerPack = calculateTotalQuantityPerPack(
          resut[key]?.items || [],
        );

        const { totalPrice, totalVolume } = resut[key].items.reduce<{
          totalVolume: number;
          totalPrice: number;
        }>(
          (r, itemDetail) => {
            // const price = volume * itemDetail.

            r.totalVolume += itemDetail.totalVolume;

            return r;
          },
          { totalVolume: 0, totalPrice: 0 },
        );

        resut[key].totalPrice = totalPrice;
        resut[key].totalVolume = totalVolume;
      }
    });

    return Object.values(resut);
  })();

  const totalOrderVolume = listProducts.reduce(
    (t, product) => t + product.totalVolume,
    0,
  );

  const moveToEdit = () => {
    if (order) {
      router.push(`/orders/${order.id}/edit?` + searchParms.toString());
    } else {
      router.push('/orders/new-entry?' + searchParms.toString());
    }
  };

  const handleCreateNewOrder = async () => {
    try {
      if (!formData || !itemGroup) return null;
      const itemDetails = formatItemDetails(formData);

      await Orders.save(
        {
          customerId: +(formData.manager || ''),
          destinationId: +(formData.location || ''),
          memo: formData.notice || '',
          temporalyFlag: false,
          itemDetails: Object.values(itemDetails),
          mixedLoadingFlag: formData.mixedLoadingFlag || false,
          vehicleClassDiv: formData.transportVehicle || '',
          requestedDeadline: formData.deliveryDate
            ? formData.deliveryDate.toISOString()
            : null,
          tradingCompany: tradingCompany,
          supplierCd: itemGroup.supplier.supplierCd,
          itemCd: itemGroupId,
        },
        accessToken,
      );

      router.push('/orders/completion');
    } catch (e) {
      console.error(e);
      alert('Error occurred!');
    }
  };

  const handleUpdateOrder = async () => {
    try {
      if (!formData || !itemGroup || !order?.id) return null;
      const itemDetails = formatItemDetails(formData);

      await Orders.update(
        order.id.toString(),
        {
          customerId: +(formData.manager || ''),
          destinationId: +(formData.location || ''),
          memo: formData.notice || '',
          temporalyFlag: false,
          itemDetails: Object.values(itemDetails),
          mixedLoadingFlag: formData.mixedLoadingFlag || false,
          vehicleClassDiv: formData.transportVehicle || '',
          requestedDeadline: formData.deliveryDate
            ? formData.deliveryDate.toISOString()
            : null,
          statusDiv: order.statusDiv.toString(),
        },
        accessToken,
        isDraft,
      );

      router.push(`/orders/${order?.id}/edit/completion`);
    } catch (e) {
      console.error(e);
      alert('Error occurred!');
    }
  };

  const handleSumit = async () => {
    if (!order) {
      await handleCreateNewOrder();
    } else {
      await handleUpdateOrder();
    }
  };

  if (isInvalidFormat)
    return (
      <p className="text-center text-2xl font-bold w-full mt-[50px]">
        無効な注文情報です
      </p>
    );

  if (!formData) return null;

  return (
    <div className="w-full">
      <PageHeader title="ホーム" />
      <div
        id="order-confirmation-box"
        className="h-[calc(100vh-64px)] overflow-auto pb-[400px]"
      >
        <div className=" bg-card  mt-[15px] ml-[17px] mr-[23px] pb-[93px]">
          <p className="pb-[15px] border-b-[1px] border-border border-solid font-bold text-3xl font-noto-sans-jp leading-[30px] ml-[27px] mr-[21px] pt-[28px] mt-[15px]">
            発注内容確認
          </p>

          <div className="mt-11 ml-[102px] mr-[334px]">
            <Tabs
              tabs={[
                { label: '発注内容入力', value: 0 },
                { label: '発注内容確認', value: 1 },
                { label: '発注依頼完了', value: 2 },
              ]}
              value={1}
              tabClassName="w-[33.33%]"
            />
          </div>

          <p className="mt-[72px] leading-2 tracking-[0.08px] font-noto-sans-jp text-md text-text-black ml-[47px]">
            以下の内容で発注しますか？
          </p>

          <div className="mt-3 ml-[27px] flex flex-wrap gap-x-[26px]">
            <div className="w-[78.9835%]">
              <OrderedProductSection listProducts={listProducts} />

              <OrderDetailSection
                totalOrderVolume={totalOrderVolume}
                deliveryDate={
                  formData.deliveryDate
                    ? formData.deliveryDate.toISOString()
                    : ''
                }
                location={selectedBase}
                selectedDiv={selectedDiv}
                selectedCompany={selectedCompany}
                combinedPile={formData.mixedLoadingFlag}
                tradingCompany={tradingCompany}
                replyDeadline={order?.replyDeadline}
              />

              <OrderRemarkSection
                username={username}
                companyName={selectedCompany?.companyName}
                remarks={formData.notice}
                order={order}
              />
            </div>
            <div className="w-[18.22465%] ">
              <div className="sticky top-[50px]">
                <div className="py-3 px-4  border-[#CAD5DB] border-[1px] border-solid">
                  <p>目次</p>

                  <div className="mt-1 flex flex-col gap-y-1">
                    <div
                      onClick={() => moveTo('ordered-products')}
                      className="flex items-center pb-1 border-border border-b-solid border-b-[1px] cursor-pointer"
                    >
                      <Image
                        src="/icon_arrow_down.svg"
                        className="w-[32px] h-[32px]"
                        width={32}
                        height={32}
                        alt="発注商品"
                      />
                      <p className="text-md font-noto-sans-jp leading-2 tracking-[0.08px] text-text-black">
                        発注商品
                      </p>
                    </div>
                    <div
                      onClick={() => moveTo('ordered-detail')}
                      className="flex items-center pb-1 border-border border-b-solid border-b-[1px] cursor-pointer"
                    >
                      <Image
                        src="/icon_arrow_down.svg"
                        className="w-[32px] h-[32px]"
                        width={32}
                        height={32}
                        alt="依頼内容"
                      />
                      <p className="text-md font-noto-sans-jp leading-2 tracking-[0.08px] text-text-black">
                        依頼内容
                      </p>
                    </div>
                    <div
                      onClick={() => moveTo('notice')}
                      className="flex items-center pb-1 border-border border-b-solid border-b-[1px] cursor-pointer"
                    >
                      <Image
                        src="/icon_arrow_down.svg"
                        className="w-[32px] h-[32px]"
                        alt="備考欄"
                        width={32}
                        height={32}
                      />
                      <p className="text-md font-noto-sans-jp leading-2 tracking-[0.08px] text-text-black">
                        備考欄
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSumit} className="mt-[18px]">
                  決定
                </Button>
                <Button
                  onClick={moveToEdit}
                  className="mt-[13px] bg-transparent !text-primary border-[2px] border-primary border-solid"
                >
                  内容を修正
                </Button>

                <div className="px-4 py-3">
                  <div className="flex items-center ">
                    <Image
                      src={'/icon_phone_32.svg'}
                      width={18}
                      height={18}
                      alt="phone"
                    />
                    <p className="font-noto-sans-jp font-bold leading-2 tracking-[0.08px] text-md text-text-black">
                      03-1234-5678
                    </p>
                  </div>
                  <p className=" mt-1 text-sm leading-2 tracking-[0.06px] font-noto-sans-jp text-text-black">
                    ファーストウッド株式会社
                  </p>
                  <p className=" mt-2 text-sm leading-2 tracking-[0.06px] font-noto-sans-jp text-gray">
                    その他ご要望については、詳細情報を添付いただくか、弊社まで直接お電話ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card mt-10 pt-[46px] ml-[17px] mr-[23px] mb-4">
          <p className="text-2xl text-text-black font-noto-sans-jp font-bold leading-0 text-center">
            内容の確認後、決定ボタンを押してください
          </p>

          <div className="flex items-center justify-center mt-[25px] gap-x-[15px] pb-11 ">
            <Button onClick={handleSumit} className="!w-[280px]">
              決定
            </Button>
            <Button
              onClick={moveToEdit}
              className=" !w-[280px] bg-transparent !text-primary border-[2px] border-primary border-solid"
            >
              内容を修正
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const convertProductsFromPullDown = (data: PulldownNewEntry) => {
  const result: {
    [productId: string]: {
      id: string | undefined;
      desireQuantity: string;
    }[];
  } = {};

  Object.values(data.products || {}).forEach(product => {
    if (!result[product.productId || '']) result[product.productId || ''] = [];

    if (+product.desireQuantity && +product.desireQuantity !== 0) {
      result[product.productId || ''].push({
        desireQuantity: product.desireQuantity,
        id: product.id,
      });
    }
  });

  return result;
};

const convertProductsFromTabular = (
  data: TabularNewEntry,
  itemGroupId: string,
) => {
  const result: {
    [productId: string]: {
      id: string | undefined;
      desireQuantity: string;
    }[];
  } = { [itemGroupId]: [] };

  Object.keys(data.items || {}).forEach(key => {
    if (key && data.items && +data.items[key]) {
      result[itemGroupId].push({
        id: key,
        desireQuantity: ((data.items || {})[key] || '').toString(),
      });
    }
  });

  return result;
};
