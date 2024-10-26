import SectionTitle from '@/app/components/SectionTitle';
import { ItemDetail } from '@/app/types/api-response';
import React from 'react';
import TableListProductDetails from '../TableListProductDetails';

export interface OrderedProductSectionProps {
  listProducts: {
    productName: string;
    totalVolume: number;
    supplierName: string;
    totalQuantityPerPack: number;
    items: (ItemDetail & { desireQuantity: number; totalVolume: number })[];
  }[];
}

export function OrderedProductSection({
  listProducts,
}: OrderedProductSectionProps) {
  return (
    <div id="ordered-products">
      <SectionTitle title="発注商品" className="border-l-[#61876E]" />
      <div className="mr-[39px] ">
        <TableListProductDetails products={listProducts}  />
      </div>
    </div>
  );
}
