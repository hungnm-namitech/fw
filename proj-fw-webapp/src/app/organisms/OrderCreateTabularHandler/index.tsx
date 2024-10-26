'use client';
import { DataDescription } from '@/app/components/DataDescription';

import { TabularOrderInformation } from '@/app/molecules/TabularOrderInformation';
import { ItemDetail, ItemGroupDetail } from '@/app/types/api-response';
import { CompanyBase, DivValue, Order, Staff } from '@/app/types/entities';
import {
  checkActiveCreateDraftBtn,
  formatTabularItemDetails,
  makeTabularCreateOrderEntrySchema,
} from '@/app/utils/orders';
import dynamic from 'next/dynamic';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import OrderCreateCommonForm from '../OrderCreateCommonForm';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Orders from '@/app/api/entities/orders';
import moment from 'moment';
import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { setNewEntryFormData } from '@/app/reducers/orders/newOrderFormValue';
import { selectNewEntryFormData } from '@/app/selectors/orders';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { SAVE_DRAFT } from '@/lib/constants';

const CreateOrderActions = dynamic(
  () => import('@/app/molecules/CreateOrderActions'),
  { ssr: false },
);

export interface OrderCreateTabularHandlerProps {
  staffs: Staff[];
  divValues: DivValue[];
  dropOffLocations: CompanyBase[];
  item: ItemGroupDetail;
  currentUserId: string;
  companyId: string;
  accessToken: string;
  tradingCompany: string;
  order?: Order;
  itemCd: string;
  supplierCd?: string;
  orderId?: string;
}

const INPUT_WRAPPER_COMMON_CLASSNAME = 'w-[47.1253%]';

const getDefaultFormData = (
  saveData: TabularNewEntry | PulldownNewEntry | null,
) => {
  if (saveData && saveData.type === 'tabular') return saveData;

  return {
    deliveryDate: undefined,
    manager: '',
    transportVehicle: '',
    location: '',
    notice: '',
    items: {},
  };
};

export function OrderCreateTabularHandler({
  staffs,
  dropOffLocations,
  divValues,
  item,
  companyId,
  accessToken,
  tradingCompany,
  order,
  itemCd,
  supplierCd,
  orderId,
}: OrderCreateTabularHandlerProps) {
  const formattedItems = formatTabularItemDetails(item.itemDetails);
  const router = useRouter();
  const params = useSearchParams();
  const saveDraftSchema = useMemo(
    () => makeTabularCreateOrderEntrySchema(formattedItems.data.grouppedItems),
    [item],
  );

  const [tabularGeneralError, setTabularGeneralError] = useState('');

  const dispatch = useAppDispatch();

  const saveSchema = useMemo(
    () =>
      makeTabularCreateOrderEntrySchema(
        formattedItems.data.grouppedItems,
        false,
      ),
    [item],
  );

  const isEmptyOrder = useMemo(() => {
    if (order) return false;
    return true;
  }, [order]);

  const isDraft = useMemo(() => {
    return order?.temporalyFlag;
  }, [order?.temporalyFlag]);

  const saveData = useAppSelector(selectNewEntryFormData);
  const form = useForm<TabularNewEntry>({
    defaultValues: getDefaultFormData(saveData),
    mode: 'onChange',
  });

  const today = useMemo(() => moment(), []);
  const orderBalanceLabel = useMemo(
    () => today.format('YYYY年M月の発注残量'),
    [],
  );
  const orderAmountLabel = useMemo(() => today.format('YYYY年M月の発注量'), []);

  const [importErrors, setImportErrors] = useState<string[]>([]);

  const filterEmptyRows = useCallback(
    (desireQuantity: {
      [id: string]: {
        itemDetailId: string;
        quantity: number;
      };
    }) => {
      return Object.values(desireQuantity).filter(
        item => item.itemDetailId && +item.quantity,
      );
    },
    [],
  );

  const handleSaveDraft = async (typeSaveDraft: SAVE_DRAFT) => {
    try {
      const values = form.getValues();
      await saveDraftSchema.validate(values, { abortEarly: false });

      setTabularGeneralError('');
      try {
        const itemDetails: {
          [id: string]: { itemDetailId: string; quantity: number };
        } = {};

        const items = values.items || {};

        Object.keys(items).forEach(id => {
          itemDetails[id] = {
            itemDetailId: id,
            quantity: +items[id],
          };
        });

        const filledRows = filterEmptyRows(itemDetails);

        const requestedDeadline = values?.deliveryDate
          ? values.deliveryDate.toISOString()
          : null;

        const submitData = {
          customerId: +(values.manager || ''),
          destinationId: +(values.location || ''),
          memo: values.notice || '',
          temporalyFlag: true,
          itemDetails: Object.values(filledRows),
          mixedLoadingFlag: values.mixedLoadingFlag || false,
          vehicleClassDiv: values.transportVehicle || '',
          requestedDeadline: requestedDeadline,
          tradingCompany: tradingCompany || null,
          itemCd,
          supplierCd,
        };
        if (checkActiveCreateDraftBtn(isDraft, isEmptyOrder, orderId)) {
          if (order && !orderId) {
            // Update current order
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
      console.debug(error);
      if (error && error.inner) {
        error.inner.forEach((err: any) => {
          console.debug(err);
          form.setError(err.path, { message: err.message });
        });
      }
    }
  };

  const items = form.watch(`items`) || {};

  const volumeItems = formattedItems.data.grouppedItems.reduce<{
    [k: string]: number;
  }>((volumes, iDetail) => {
    volumes[iDetail.hashedId] = Object.keys(iDetail.variantIds).reduce(
      (total, key) => {
        const id = iDetail.variantIds[key];
        return total + (+items[id] || 0) * iDetail.volumes[key];
      },
      0,
    );

    return volumes;
  }, {});

  const totalVolumes = Object.values(volumeItems).reduce(
    (total, volume) => total + volume,
    0,
  );

  const totalOrderQuantity = (() => {
    const totalOrder: { [length: string]: number } = {};

    formattedItems.data.grouppedItems.forEach(grouppedItem => {
      Object.keys(grouppedItem.variantIds).forEach(key => {
        const id = grouppedItem.variantIds[key];

        if (!totalOrder[key]) totalOrder[key] = 0;

        totalOrder[key] += +(items[id] || 0);
      });
    });

    return totalOrder;
  })();

  const handleSubmit = async (data: any) => {
    setTabularGeneralError('');
    try {
      await saveSchema.validate(data, { abortEarly: false });
      const itemDetails: {
        [id: string]: { itemDetailId: string; quantity: number };
      } = {};

      const items = data.items || {};

      Object.keys(items).forEach(id => {
        itemDetails[id] = {
          itemDetailId: id,
          quantity: +items[id],
        };
      });

      const filledRows = filterEmptyRows(itemDetails);

      if (!Object.keys(filledRows).length) {
        setTabularGeneralError('少なくとも 1 つの製品を選択する必要があります');
        moveToError();
        return;
      }

      dispatch(setNewEntryFormData({ ...data, type: 'tabular' }));

      process.nextTick(() => {
        let path = '/orders/confirmation?' + params.toString();

        if (!!order && !orderId) {
          path = `/orders/${order.id}/edit/confirmation` + params.toString();
        }
        console.debug(path);
        router.push(path);
      });
    } catch (e) {
      // console.debug(error);
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

  const onImportCSV = (
    itemDetails: (ItemDetail & { desireQuantity: number })[],
    errors: string[],
  ) => {
    const items: {
      [id: string]: number;
    } = {};

    item.itemDetails.forEach(iDetail => (items[iDetail.id] = '' as any));

    itemDetails.forEach(foundItem => {
      items[foundItem.id.toString()] = foundItem.desireQuantity;
    });

    form.setValue('items', items);

    setImportErrors(errors);
  };

  const deliveryDate = form.watch('deliveryDate');
  const vehicleSelectedId = form.watch('transportVehicle');

  const selectedVehicle = divValues.find(
    div => +div.divValue === +(vehicleSelectedId || ''),
  );

  const moveToError = useCallback(() => {
    process.nextTick(() => {
      const error = document.querySelector(
        '[data-error]',
      ) as HTMLElement | null;
      if (error) {
        const y = error.offsetTop - 200;
        document
          ?.querySelector('[data-scroll-error]')
          ?.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }, []);

  if (formattedItems.error) return <div>Invalid data format</div>;

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
      <div className="ml-[73px] mr-[73px] ">
        <div className="flex items-center gap-x-[5.7492%]">
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
        <div className=" mt-[23px]">
          {tabularGeneralError && (
            <p className="py-[10px] text-red-500" data-error="error">
              {tabularGeneralError}
            </p>
          )}
          <TabularOrderInformation
            form={form}
            lengths={formattedItems.data.lengths.map(length => ({
              id: length,
              label: length,
            }))}
            width={formattedItems.data.width}
            rows={formattedItems.data.grouppedItems.map(iDetail => ({
              id: iDetail.hashedId,
              quantity: iDetail.quantityPerPack,
              thickness: iDetail.thickness,
              variantIds: iDetail.variantIds,
            }))}
            totalVolumes={totalVolumes}
            volumeItems={volumeItems}
            totalOrderQuantity={totalOrderQuantity}
          />
        </div>
      </div>

      <CreateOrderActions
        isEmptyOrder={isEmptyOrder}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        form={form as any}
        totalVolume={+totalVolumes.toFixed(4)}
        requestedDeliveryDate={deliveryDate}
        transportVehicle={selectedVehicle?.divValueName}
        onAfterReset={() => {
          form.setValue('items', getDefaultFormData(saveData).items);
        }}
        isDraft={isDraft}
        orderId={orderId as string}
      />
    </>
  );
}
