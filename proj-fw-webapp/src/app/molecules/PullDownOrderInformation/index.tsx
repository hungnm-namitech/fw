'use client';

import { Button } from '@/app/components/Button';
import { ICONS } from '@/app/components/assets/icons';
import { ItemDetail } from '@/app/types/api-response';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PullDownOrderTableRow } from '../PullDownOrderTableRow';

interface PullDownOrderInformationProps {
  form: UseFormReturn<
    {
      deliveryDate: null | Date;
      manager: string | undefined;
      transportVehicle: string | undefined;
      location: string | undefined;
      notice: string;
      products: {
        [randomKey: string]: {
          id: string | undefined;
          productId: string | undefined;
          desireQuantity: string;
        };
      };
    },
    any,
    undefined
  >;

  items: {
    [productCd: string]: {
      productCd: string;
      productName: string;
      volumes: { [k: string]: number };
      quantity: number;
      variants: Pick<
        ItemDetail,
        | 'itemVolume'
        | 'quantityPerPack'
        | 'thickness'
        | 'unitPrice'
        | 'width'
        | 'length'
        | 'id'
      >[];
    };
  };
  onAdd: () => void;
}

const TABLE_HEADER_COMMON_CLASS_NAMES =
  'text-center text-xl leading-2 font-bold font-noto-sans-jp tracking-[0.1px] text-text-black pb-[5px] pt-[7px]';

const TR_COMMON_CLASS_NAMES = 'border-b-[1px] border-solid border-border';

export function PullDownOrderInformation({
  form,
  items,
  onAdd,
}: PullDownOrderInformationProps) {
  const productForms = form.watch('products');
  const totalInput = Object.keys(form.getValues('products') || {}).length;

  const keys = Object.keys(productForms);

  const listProducts = useMemo(() => Object.values(items), [items]);

  return (
    <div>
      <table className="table m-auto ">
        <thead>
          <tr
            className={clsx(
              'bg-[#E9E9E9] table-row h-[48px]',
              TR_COMMON_CLASS_NAMES,
            )}
          >
            <td className="w-[300px]">
              <p className={TABLE_HEADER_COMMON_CLASS_NAMES}>製品名</p>
            </td>
            <td className="w-[300px]">
              <p className={TABLE_HEADER_COMMON_CLASS_NAMES}>サイズ</p>
            </td>
            <td className="w-[160px]">
              <p className={TABLE_HEADER_COMMON_CLASS_NAMES}>入数</p>
            </td>
            <td className="w-[160px]">
              <p className={TABLE_HEADER_COMMON_CLASS_NAMES}>バンドル数</p>
            </td>
            <td className="w-[160px]">
              <p className={TABLE_HEADER_COMMON_CLASS_NAMES}>材積</p>
            </td>
          </tr>
        </thead>

        <tbody>
          {keys.map(key => (
            <PullDownOrderTableRow
              formId={key}
              key={key}
              products={listProducts}
              productMaps={items}
              form={form}
            />
          ))}
        </tbody>
      </table>
      <div className="mt-1">
        <Button
          color="primary"
          onClick={onAdd}
          disabled={totalInput >= 20}
          className={clsx(
            'bg-transparent border-primary border-solid  border-[1px] flex items-center justify-center !w-[290px] m-auto py-[9px] pl-4 pr-5 !min-h-[36px]',
            {
              'bg-[#d3d3d3] cursor-not-allowed border-[#d3d3d3] ':
                totalInput >= 20,
            },
          )}
        >
          <Image src={ICONS.ADD} alt="Add" className="text-white" />
          <span className="text-primary text-sm font-bold leading-[125%] font-noto-sans-jp w-[98px] h-[18px]">
            行を追加する
          </span>
        </Button>
      </div>
    </div>
  );
}
