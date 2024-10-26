'use client';

import React from 'react';
import './style.scss';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TabularNewEntry } from '@/app/types/orders';
import clsx from 'clsx';
import { ChangeEvent } from 'react';

interface TabularOrderInformationProps {
  lengths: { id: string; label: string }[];
  rows: {
    thickness: number;
    quantity: number;
    id: string;
    variantIds: { [length: string]: string };
  }[];
  width: number;
  form: UseFormReturn<TabularNewEntry>;
  volumeItems: { [k: number]: number };
  totalVolumes: number;
  totalOrderQuantity: { [k: string]: number };
}

export function TabularOrderInformation({
  lengths,
  rows,
  form,
  width,
  volumeItems,
  totalVolumes,
  totalOrderQuantity,
}: TabularOrderInformationProps) {
  const totalLengths = lengths.length;
  
  return (
    <>
      <div className="relative mb-60">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse overflow-x-auto">
            <thead>
              <tr>
                <th
                  className="w-[100px] min-w-[100px] max-w-[100px]  py-[14px] px-[20px] sticky left-0 z-9 bg-[#E9E9E9]  border-b-[2px] border-solid border-[#CFCFCF] text-2xl font-bold leading-[125%] font-noto-sans-jp "
                  rowSpan={2}
                >
                  {width}W
                </th>
                <th
                  className="w-[100px] min-w-[100px] max-w-[100px] bg-[#E9E9E9] py-[14px] px-[20px] sticky left-[100px]  border-b-[2px] border-solid border-[#CFCFCF] z-9 text-xl font-bold font-noto-sans-jp"
                  rowSpan={2}
                >
                  入数
                </th>
                <th
                  className="bg-[#E9E9E9] py-[14px] px-[20px] fixed-header h-[45px]"
                  colSpan={totalLengths}
                >
                  <span className="absolute left-1/2 top-[10px] text-2xl leading-[25px] px-5-1 font-noto-sans-jp">
                    長さ
                  </span>
                </th>
                <th
                  className="w-[100px] min-w-[100px] max-w-[170px] bg-[#E9E9E9] py-[14px] px-[20px]  border-b-[2px] border-solid border-[#CFCFCF] sticky right-0  text-md font-noto-sans-jp leading-[125%] font-bold"
                  rowSpan={2}
                >
                  合計
                </th>
              </tr>
              <tr>
                {lengths.map(length => (
                  <td
                    className="w-[100px] min-w-[100px] max-w-[100px] bg-[#d9d9d9] text-center leading-[125%] font-bold text-md font-noto-sans-jp py-[14px] px-5-1  border-b-[2px] border-solid border-[#CFCFCF] "
                    key={length.id}
                  >
                    {length.label}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr className="table-row" key={row.id}>
                  <td className="table-cell bg-[#E9E9E9] sticky left-0 text-center leading-[125%] font-bold text-md font-noto-sans-jp py-[14px] border-b-[2px] border-solid border-[#CFCFCF]">
                    {row.thickness}
                  </td>
                  <td className="table-cell bg-[#E9E9E9] sticky left-[100px] text-center leading-[125%] font-bold text-md font-noto-sans-jp py-[14px]  border-b-[2px] border-solid border-[#CFCFCF]">
                    {row.quantity}
                  </td>
                  {lengths.map((length, index) => (
                    <td
                      className={clsx(
                        'table-cell bg-white text-center  leading-[125%] max-w-[100px]  text-md font-noto-sans-jp py-[14px]   px-5-1 border-b-[2px] border-solid border-[#CFCFCF]',
                        { '!bg-[#d9d9d9]': !row.variantIds[length.id] },
                      )}
                      key={length.id}
                    >
                      {!!row.variantIds[length.id] ? (
                         <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Controller
                          defaultValue={'' as any}
                          name={`items.${row.variantIds[length.id]}`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <input
                                placeholder="0"
                                className="w-[45px] text-center"
                                {...field}
                                value={field.value || ''}
                                onInput={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                
                              />
                              {fieldState.error?.message && (
                                <span className="text-xs text-red-600 ">
                                  {fieldState.error.message}
                                </span>
                              )}
                             </div>
                            </>
                          )}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button
                               type="button"
                               className="btn-increase "
                            onClick={() => {
                              const currentValue = parseInt(String(form.getValues(`items.${row.variantIds[length.id]}`)), 10) || 0;
                              if (!isNaN(currentValue)) {
                                form.setValue(`items.${row.variantIds[length.id]}`, currentValue + 1);
                              }
                            }}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="btn-decrease"
                            onClick={() => {
                              const currentValue = parseInt(String(form.getValues(`items.${row.variantIds[length.id]}`)), 10) || 0;
                              if (!isNaN(currentValue) && currentValue > 0) {
                                form.setValue(`items.${row.variantIds[length.id]}`, currentValue - 1);
                              }
                            }}
                          >
                            -
                          </button>
                        </div>
                        </div>
                      ) : (
                        <div className="bg-gray w-full h-full"></div>
                      )}
                    </td>
                  ))}

                  <td className="table-cell sticky bg-white right-0 text-center  border-b-[2px] border-solid border-[#CFCFCF] ">
                    <p className="font-noto-sans-jp text-md font-bold leading-[125%] py-[14px] px-5-1 text-end ">
                      {+volumeItems[row.id as any].toFixed(4)} ㎥
                    </p>
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  className="w-[100px] min-w-[100px] max-w-[100px]  py-[14px] text-center px-[20px] sticky left-0 z-9 bg-[#E9E9E9]  border-b-[2px] border-solid border-[#CFCFCF] text-2xl font-bold leading-[125%] font-noto-sans-jp "
                  colSpan={2}
                >
                  合計
                </td>
                {lengths.map(length => (
                  <td
                    className="w-[100px] min-w-[100px] max-w-[100px] bg-[#d9d9d9] text-center leading-[125%] font-bold text-md font-noto-sans-jp py-[14px] px-5  border-b-[2px] border-solid border-[#CFCFCF] "
                    key={length.id}
                  >
                    {totalOrderQuantity[length.label]}
                  </td>
                ))}
                <td className="table-cell sticky bg-white right-0 text-center  border-b-[2px] border-solid border-[#CFCFCF] ">
                  <p className="font-noto-sans-jp text-md font-bold leading-[125%] py-[14px] px-5-1 text-end ">
                    {+totalVolumes.toFixed(4)} ㎥
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
