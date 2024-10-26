export declare type ItemDetail = {
  id: number | string;
  width: number;
  thickness: number;
  length: number;
  itemVolume: number;
  quantityPerPack: number;
  productName: string;
  productId: string;
  productCd: string;
  unitPrice: number;
  gradeStrength: string;
};

export declare type ItemGroupDetail = {
  type: number;
  itemName: string;
  monthlyForecast: number;
  totalOrderQuantity: number;
  itemDetails: ItemDetail[];
  supplier: {
    supplierCd: string;
    supplierName: string;
    supplierNameKana: string;
  };
};
