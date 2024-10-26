export interface IDataProductSample {
  productCd: string;
  productName: string;
  productDisplayName?: string,
  itemCd: string;
  supplierCd: string;
  productId: number;
  gradeStrength?: string;
  memo?: string;
  trailer?: string;
  capacityMin?: string;
  capacityMax?: string;
}
