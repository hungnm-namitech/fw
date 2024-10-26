'use client';
import { ItemGroupDetail } from '@/app/types/api-response';
import { CompanyBase, DivValue, Order, Staff } from '@/app/types/entities';
import React from 'react';
import { OrderCreateTabularHandler } from '../OrderCreateTabularHandler';
import { OrderCreatePullDownHandler } from '../OrderCreatePullDownHandler';

export interface OrderDetailFormProps {
  staffs: Staff[];
  item: ItemGroupDetail;
  bases: CompanyBase[];
  divValues: DivValue[];
  itemGroupId: number;
  accessToken: string;
  companyId: string;
  currentUserId: string;
  tradingCompany: string;
  order?: Order;
  supplierCd: string;
  orderId?: string;
}

export function OrderDetailForm({
  staffs,
  divValues,
  itemGroupId,
  bases,
  item,
  accessToken,
  companyId,
  currentUserId,
  tradingCompany,
  order,
  supplierCd,
  orderId,
}: OrderDetailFormProps) {
  if (item.type === 2) {
    return (
      <OrderCreatePullDownHandler
        accessToken={accessToken}
        companyId={companyId}
        currentUserId={currentUserId}
        dropOffLocations={bases}
        item={item}
        staffs={staffs}
        divValues={divValues}
        tradingCompany={tradingCompany}
        order={order}
        itemCd={itemGroupId.toString()}
        supplierCd={supplierCd}
        orderId={orderId}
      />
    );
  }

  return (
    <OrderCreateTabularHandler
      accessToken={accessToken}
      companyId={companyId}
      currentUserId={currentUserId}
      dropOffLocations={bases}
      item={item}
      staffs={staffs}
      divValues={divValues}
      tradingCompany={tradingCompany}
      order={order}
      itemCd={itemGroupId.toString()}
      supplierCd={supplierCd}
      orderId={orderId}
    />
  );
}
