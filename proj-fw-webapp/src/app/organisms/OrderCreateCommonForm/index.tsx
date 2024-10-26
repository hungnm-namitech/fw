import { CheckBox } from '@/app/components/CheckBox';
import { DatePicker } from '@/app/components/DatePicker';
import { FileUpdateButton } from '@/app/components/FileUploadButton';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ICONS } from '@/app/components/assets/icons';
import Select from '@/app/components/Select';
import Textarea from '@/app/components/Textarea';
import { ORDER_INPUT } from '@/app/constants/orders.const';
import moment from 'moment';
import { CompanyBase, DivValue, Staff } from '@/app/types/entities';
import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { formatInputCsvItemDetails } from '@/app/utils/orders';
import { ItemDetail, ItemGroupDetail } from '@/app/types/api-response';
import { SAVE_DRAFT } from '@/lib/constants';

interface OrderCreateCommonFormProps {
  form: UseFormReturn<PulldownNewEntry | TabularNewEntry>;
  staffs: Staff[];
  divValues: DivValue[];
  dropOffLocations: CompanyBase[];
  item: ItemGroupDetail;
  onSaveDraft: (data: any) => void;
  onImportSuccess?: (
    itemDetails: (ItemDetail & { desireQuantity: number })[],
    errors: string[],
  ) => void;
}
const INPUT_WRAPPER_COMMON_CLASSNAME = 'w-[47.1253%]';

export default function OrderCreateCommonForm({
  form,
  staffs,
  divValues,
  dropOffLocations,
  item,
  onSaveDraft,
  onImportSuccess = () => {},
}: OrderCreateCommonFormProps) {
  const minDate = useMemo(() => moment().add('days', 1).toDate(), []);

  const { control } = form;
  const createItemDetailKey = useCallback(
    ({
      productName,
      width,
      thickness,
      length,
      quantityPerPack,
      gradeStrength,
    }: Pick<
      ItemDetail,
      | 'productName'
      | 'width'
      | 'thickness'
      | 'length'
      | 'quantityPerPack'
      | 'gradeStrength'
    >) =>
      `${productName || ''}:${width || ''}:${thickness || ''}:${length || ''}:${
        quantityPerPack || ''
      }:${gradeStrength || ''}`,
    [],
  );

  const formattedItems = useMemo(
    () =>
      item.itemDetails.reduce<{
        [key: string]: ItemDetail;
      }>((itemDetails, itemDetail) => {
        itemDetails[createItemDetailKey(itemDetail)] = itemDetail;
        return itemDetails;
      }, {}),
    [createItemDetailKey, item],
  );

  const handleUploadCsv = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rows = await formatInputCsvItemDetails(e);

      const foundItems: (ItemDetail & { desireQuantity: number })[] = [];
      const errors: string[] = [];

      rows.forEach(row => {
        const foundItem = formattedItems[createItemDetailKey(row)];
        if (foundItem) {
          if (row.desireQuantity) {
            foundItems.push({
              ...foundItem,
              desireQuantity: row.desireQuantity,
            });
          }
        } else {
          errors.push(
            `項目が見つかりません ${createItemDetailKey(row).replaceAll(
              ':',
              '、',
            )}`,
          );
        }
      });

      onImportSuccess(foundItems, errors);
    },
    [formattedItems],
  );

  const changeLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if( e.target.value === "0" ) {
      onSaveDraft(SAVE_DRAFT.ADD_DESTINATION)
    }
  };

  return (
    <div className="flex items-center gap-x-[5.7492%] ml-[7.2307%] mr-[11.1538%] flex-wrap gap-y-[6px]">
      <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
        <Controller
          control={control}
          name="deliveryDate"
          render={({ field, fieldState }) => (
            <DatePicker
              // onKeyDown={e => {
              //   if (e.code !== 'Backspace') e.preventDefault();
              // }}
              error={fieldState.error?.message}
              label={ORDER_INPUT.DELIVERY_DATE.LABEL}
              labelClassName="leading-[22px] tracking-[-0.28px] !text-bold"
              selected={field.value}
              minDate={minDate}
              onChange={date => field.onChange(date)}
              dateFormat={'yyyy/MM/dd'}
              placeholderText="YYYY/MM/DD"
            />
          )}
        />
      </div>
      <div
        className={clsx(
          INPUT_WRAPPER_COMMON_CLASSNAME,
          'flex items-end mb-3 h-full self-end',
        )}
      >
        <Controller
          control={control}
          name="mixedLoadingFlag"
          render={({ field }) => (
            <CheckBox
              {...(field as any)}
              checked={field.value || false}
              checkedImage="/order-checkbox-checked.svg"
              label="合積みする場合こちらをチェックしてください"
            />
          )}
        />
      </div>
      <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
        <Controller
          name="manager"
          control={control}
          render={({ field, fieldState }) => (
            <Select
              label={ORDER_INPUT.MANAGER.LABEL}
              options={staffs.map(staff => ({
                value: staff.id.toString(),
                label: staff.staffName,
              }))}
              placeholder="選択してください"
              error={fieldState.error?.message}
              {...field}
              value={field.value || ''}
              className="!text-md leading-[22px] !pt-[13px] !pb-3"
              labelClassName="leading-[22px] tracking-[-0.28px] !text-bold "
            />
          )}
        />
      </div>
      <div className={clsx(INPUT_WRAPPER_COMMON_CLASSNAME, 'pt-[26px]')}>
        <FileUpdateButton
          icon={ICONS.GREEN_CSV_UPLOAD}
          id="csv-upload"
          label={ORDER_INPUT.CSV_UPLOAD.LABEL}
          onUpload={handleUploadCsv}
          accepts={['.csv', '.xlsx']}
          className="text-primary "
          labelClassName="!border-primary !text-bold"
        />
      </div>
      <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
        <Controller
          name="transportVehicle"
          render={({ field, fieldState }) => (
            <Select
              label={ORDER_INPUT.TRANSPORT_VEHICLE.LABEL}
              options={divValues.map(div => ({
                value: div.divValue.toString(),
                label: div.divValueName,
              }))}
              placeholder="選択してください"
              error={fieldState.error?.message}
              {...field}
              value={field.value || ''}
              className="!text-md leading-[22px] !pt-[13px] !pb-3"
              labelClassName="leading-[22px] tracking-[-0.28px] !text-bold"
            />
          )}
          control={control}
        />
        <div className="mt-2 mb-[38px] relative">
          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <Select
                label={ORDER_INPUT.LOCATION.LABEL}
                options={dropOffLocations.map(location => ({
                  label: location.baseName,
                  value: location.id.toString(),
                })).concat({
                  label: "＋ 降ろし先情報を追加する",
                  value: "0",
                })}
                error={fieldState.error?.message}
                placeholder="選択してください"
                {...field}
                value={field.value || ''}
                className="!text-md leading-[22px] !pt-[13px] !pb-3"
                labelClassName="leading-[22px] tracking-[-0.28px] !text-bold"
                onChange={(e) => changeLocation(e)}
              />
            )}
          />
          {/* <button
            onClick={form.handleSubmit(() =>
              onSaveDraft(SAVE_DRAFT.ADD_DESTINATION),
            )}
            className="text-[#2A74AA] font-md leading-[22px] tracking-[-0.32px]  absolute right-4 -bottom-4 translate-y-full"
          >
            ＋ 卸し先を追加する
          </button> */}
        </div>
      </div>
      <div className={INPUT_WRAPPER_COMMON_CLASSNAME}>
        <Controller
          control={control}
          name="notice"
          render={({ field, fieldState }) => (
            <>
              <Textarea
                label={ORDER_INPUT.NOTICE.LABEL}
                placeholder="テキストを入力"
                error={fieldState.error?.message}
                {...field}
                className="h-[128px]"
                labelClassName="leading-[22px] tracking-[-0.28px] !text-bold"
              />
            </>
          )}
        />
      </div>
    </div>
  );
}
