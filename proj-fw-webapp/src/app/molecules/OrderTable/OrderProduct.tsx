import SectionTitle from '@/app/components/SectionTitle';
import { ItemDetail } from '@/app/types/api-response';
import { ItemDetailOrder, ProductDetails } from '@/app/types/entities';
import React, { FC, useMemo } from 'react';
import TableListProductDetails, {
  TableListProductDetailsProps,
} from '../TableListProductDetails';
import { calculateTotalQuantityPerPack } from '@/app/utils/orders';

interface OrderListProps {
  products: ProductDetails[];
  supplierName: string;
  orderQuantity: number;
  itemName: string;
}

const OrderProduct: FC<OrderListProps> = ({
  products: productDetails,
  supplierName,
  orderQuantity,
  itemName,
}: OrderListProps) => {
  const listProducts: TableListProductDetailsProps['products'] = useMemo(() => {
    const products: TableListProductDetailsProps['products'] = [
      {
        items: productDetails.map(pDetail => ({
          desireQuantity: pDetail.desireQuantity,
          gradeStrength: pDetail.gradeStrength,
          length: +pDetail.length,
          productName: pDetail.productName,
          quantityPerPack: pDetail.quantityPerPack,
          thickness: pDetail.thickness,
          totalVolume: +(pDetail.itemVolume * pDetail.desireQuantity).toFixed(
            4,
          ),
          width: pDetail.width,
        })),
        productName: itemName,
        supplierName: supplierName,
        totalVolume: orderQuantity,
        totalQuantityPerPack: calculateTotalQuantityPerPack(productDetails),
      },
    ];

    return products;
  }, [productDetails, supplierName, orderQuantity]);

  return (
    <div id="order-product-list">
      <SectionTitle
        toggleClose={() => {}}
        title="発注商品"
        className=" min-h-[56px] border-b-[1px] border-b-[#3C6255] flex items-center border-l-[#61876E] bg-[#F5F5F5]"
      />
      <div>
        <TableListProductDetails products={listProducts} />
      </div>
    </div>
  );
};

export default OrderProduct;
