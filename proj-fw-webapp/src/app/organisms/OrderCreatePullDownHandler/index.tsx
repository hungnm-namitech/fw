'use client';

import { DataDescription } from '@/app/components/DataDescription';
import { PullDownOrderInformation } from '@/app/molecules/PullDownOrderInformation';
import { ItemDetail, ItemGroupDetail } from '@/app/types/api-response';
import { CompanyBase, DivValue, Order, Staff } from '@/app/types/entities';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import OrderCreateCommonForm from '../OrderCreateCommonForm';
import {
  checkActiveCreateDraftBtn,
  formatPulldownItemDetails,
  getPulldownTotalVolume,
  makePullDownCreateOrderEntrySchema,
  makePulldownInputId,
} from '@/app/utils/orders';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Orders from '@/app/api/entities/orders';
import { PulldownNewEntry } from '@/app/types/orders';
import { selectNewEntryFormData } from '@/app/selectors/orders';
import { setNewEntryFormData } from '@/app/reducers/orders/newOrderFormValue';
import { useAppDispatch, useAppSelector } from '@/app/store';
import moment from 'moment';
import { SAVE_DRAFT } from '@/lib/constants';

const CreateOrderActions = dynamic(
  () => import('@/app/molecules/CreateOrderActions'),
  { ssr: false },
);

export interface OrderCreatePullDownHandlerProps {
  staffs: Staff[];
  divValues: DivValue[];
  dropOffLocations: CompanyBase[];
  item: ItemGroupDetail;
  currentUserId: string;
  accessToken: string;
  companyId: string;
  tradingCompany: string;
  order?: Order;
  itemCd: string;
  supplierCd: string;
  orderId?: string;
}

const INPUT_WRAPPER_COMMON_CLASSNAME = 'w-[47.1253%]';

export function OrderCreatePullDownHandler({
  staffs,
  dropOffLocations,
  divValues,
  item,
  accessToken,
  companyId,
  tradingCompany,
  order,
  itemCd,
  supplierCd,
  orderId,
}: OrderCreatePullDownHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formattedData = useMemo(
    () => formatPulldownItemDetails(item.itemDetails),
    [item],
  );

  const isEmptyOrder = useMemo(() => {
    if (order) return false;
    return true;
  }, [order]);

  const isDraft = useMemo(() => {
    return order?.temporalyFlag;
  }, [order?.temporalyFlag]);

  const savedData = useAppSelector(selectNewEntryFormData);
  const dispatch = useAppDispatch();

  const [importErrors, setImportErrors] = useState<string[]>([]);

  const form = useForm<PulldownNewEntry>({
    defaultValues:
      savedData?.type === 'pulldown'
        ? savedData
        : {
            deliveryDate: undefined,
            manager: '',
            transportVehicle: '',
            location: '',
            mixedLoadingFlag: false,
            notice: '',
            products: {},
          },
    mode: 'onChange',
  });

  const [pulldownGeneralError, setPulldownGeneralError] = useState('');

  const createInputs = () => {
    const totalInput = Object.keys(form.getValues('products') || {}).length;
    if (totalInput < 10) {
      for (let i = 0; i < 10 - totalInput; i++) {
        handleAddProductInput();
      }
    }
  };

  useEffect(() => {
    createInputs();
  }, []);

  const handleAddProductInput = useCallback(
    (resetSchema?: boolean) => {
      const id = makePulldownInputId(6);
      form.setValue(`products.${id}`, {
        desireQuantity: '',
        id: '',
        productId: '',
      });
    },
    [form],
  );

  const filterEmptyProductInput = (
    products: PulldownNewEntry['products'] = {},
  ) => {
    const filledProducts: {
      [randomKey: string]: {
        id: string | undefined;
        productId: string | undefined;
        desireQuantity: string;
      };
    } = {};

    Object.keys(products).forEach(key => {
      const product = products[key];

      if (product.productId || product.desireQuantity || product.id) {
        filledProducts[key] = product;
      }
    });

    return filledProducts;
  };

  const handleSubmit = async () => {
    setPulldownGeneralError('');

    const values = form.getValues();
    const filledProducts = filterEmptyProductInput(
      form.getValues('products') || {},
    );
    const filteredData: any = {};
    Object.keys(filledProducts).forEach(key => {
      const item = filledProducts[key];
      if (item.desireQuantity !== '0') {
        filteredData[key] = item;
      }
    });
    let hasPropertiesInAnySubObject = false;
    for (const subObjectKey in filteredData) {
      if (Object.keys(filteredData[subObjectKey]).length > 0) {
        hasPropertiesInAnySubObject = true;
        break;
      }
    }
    const saveSchema = makePullDownCreateOrderEntrySchema(
      hasPropertiesInAnySubObject ? filteredData : filledProducts,
      false,
    );

    try {
      if (!Object.keys(filledProducts).length) {
        setPulldownGeneralError(
          '少なくとも 1 つの製品を選択する必要があります',
        );
        moveToError();
      }

      await saveSchema.validate(values, { abortEarly: false });

      if (Object.keys(filledProducts).length) {
        const setValue = { ...values, type: 'pulldown' };
        dispatch(setNewEntryFormData(setValue as any));

        process.nextTick(() => {
          if (!!order && !orderId) {
            router.push(
              `/orders/${order.id}/edit/confirmation?` +
                searchParams.toString(),
            );
          } else {
            router.push('/orders/confirmation?' + searchParams.toString());
          }
        });
      }
    } catch (e) {
      handleFormError(e as any);
    }
  };

  const handleFormError = useCallback((error: any) => {
    if (error && error.inner) {
      error.inner.forEach((err: any) => {
        form.setError(err.path, { message: err.message });
      });

      moveToError();
    }
  }, []);

  function getOffsetTop(element: any) {
    let offsetTop = element.offsetTop;
    let offsetParent = element.offsetParent;

    while (offsetParent && offsetParent.tagName !== 'BODY') {
      offsetTop += offsetParent.offsetTop;
      offsetParent = offsetParent.offsetParent;
    }

    return offsetTop;
  }

  const moveToError = useCallback(() => {
    process.nextTick(() => {
      const error = document.querySelector(
        '[data-error]',
      ) as HTMLElement | null;
      if (error) {
        const y = getOffsetTop(error) - 200;
        document
          ?.querySelector('[data-scroll-error]')
          ?.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }, []);

  const handleSaveDraft = async (typeSaveDraft: SAVE_DRAFT) => {
    const values = form.getValues();
    setPulldownGeneralError('');
    const filledProducts = filterEmptyProductInput(
      form.getValues('products') || {},
    );

    const saveSchema = makePullDownCreateOrderEntrySchema(filledProducts);
    try {
      await saveSchema.validate(values, { abortEarly: false });

      try {
        const itemDetails: {
          [id: string]: { itemDetailId: string; quantity: number };
        } = {};

        const items = values.products || {};
        Object.values(items).forEach(({ desireQuantity, id }) => {
          if (id && desireQuantity) {
            itemDetails[id] = {
              itemDetailId: id,
              quantity: +desireQuantity,
            };
          }
        });

        const submitData = {
          customerId: +(values.manager || ''),
          destinationId: +(values.location || ''),
          memo: values.notice || '',
          temporalyFlag: true,
          itemDetails: Object.values(itemDetails).map(item => ({
            itemDetailId: item.itemDetailId,
            quantity: item.quantity,
          })),
          mixedLoadingFlag: values.mixedLoadingFlag || false,
          vehicleClassDiv: values.transportVehicle || '',
          requestedDeadline: values?.deliveryDate
            ? values.deliveryDate.toISOString()
            : null,
          tradingCompany: tradingCompany || null,
          itemCd,
          supplierCd,
        };
        if (checkActiveCreateDraftBtn(isDraft, isEmptyOrder, orderId)) {
          if (order && !orderId) {
            await Orders.update(
              order.id.toString(),
              { ...submitData, statusDiv: order.statusDiv.toString() },
              accessToken,
              isDraft,
            );
          } else {
            await Orders.save(submitData, accessToken);
          }

          alert('一時保存されました。');
        }

        if (typeSaveDraft === SAVE_DRAFT.SAVE_TEMP) {
          router.push('/orders');
        } else if (typeSaveDraft === SAVE_DRAFT.ADD_DESTINATION) {
          router.push('/bases/create');
        }
      } catch (e) {
        console.error(e);
        alert('Error occurred!');
      }
    } catch (e) {
      const error = e as any;
      if (error && error.inner) {
        error.inner.forEach((err: any) => {
          form.setError(err.path, { message: err.message });
        });
      }
    }
  };

  const onImportCSV = (
    itemDetails: (ItemDetail & { desireQuantity: number })[],
    errors: string[],
  ) => {
    const items: {
      [randomKey: string]: {
        id: string | undefined;
        productId: string | undefined;
        desireQuantity: string;
      };
    } = {};

    itemDetails.forEach(foundItem => {
      items[makePulldownInputId(6)] = {
        id: foundItem.id.toString(),
        productId: foundItem.productCd,
        desireQuantity: foundItem.desireQuantity.toString(),
      };
    });

    form.setValue('products', items);

    process.nextTick(createInputs);

    setImportErrors(errors);
  };

  const deliveryDate = form.watch('deliveryDate');

  const productForms = form.watch('products');

  const today = useMemo(() => moment(), []);
  const orderBalanceLabel = useMemo(
    () => today.format('YYYY年M月の発注残量'),
    [],
  );
  const orderAmountLabel = useMemo(() => today.format('YYYY年M月の発注量'), []);

  const vehicleSelectedId = form.watch('transportVehicle');

  const selectedVehicle = divValues.find(
    div => div.divValue === vehicleSelectedId,
  );

  const totalVolume = getPulldownTotalVolume(
    formattedData.data,
    productForms || {},
  );

  return (
    <>
      <OrderCreateCommonForm
        dropOffLocations={dropOffLocations}
        form={form as any}
        staffs={staffs}
        divValues={divValues}
        item={item}
        onImportSuccess={onImportCSV}
        onSaveDraft={handleSaveDraft}
      />

      <div className="ml-[87px] mr-[143px] mb-[80px]">
        <div className="flex items-center gap-x-[61px]">
          <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
            <DataDescription
              label={orderAmountLabel}
              value={item.totalOrderQuantity.toFixed(4).toString()}
              unit="㎥"
            />
          </div>
          <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
            <DataDescription
              label={orderBalanceLabel}
              value={(+Math.max(
                item.monthlyForecast - item.totalOrderQuantity,
                0,
              ).toFixed(4)).toString()}
              unit="㎥"
            />
          </div>
        </div>
        {!!importErrors.length && (
          <div className="max-h-[200px] overflow-y-scroll">
            {importErrors.map((error, index) => (
              <p className="text-[12px] text-red-500" key={index}>
                {error}
              </p>
            ))}
          </div>
        )}
        <div className="mt-[23px]">
          {pulldownGeneralError && (
            <p className="py-[10px] text-red-500" data-error="error">
              {pulldownGeneralError}
            </p>
          )}
          <PullDownOrderInformation
            onAdd={handleAddProductInput}
            items={formattedData.data}
            form={form as any}
          />
        </div>
      </div>

      <CreateOrderActions
        isEmptyOrder={isEmptyOrder}
        isDraft={isDraft}
        form={form as any}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        requestedDeliveryDate={deliveryDate}
        totalVolume={totalVolume}
        onAfterReset={createInputs}
        transportVehicle={selectedVehicle?.divValueName}
        orderId={orderId}
      />
    </>
  );
}
