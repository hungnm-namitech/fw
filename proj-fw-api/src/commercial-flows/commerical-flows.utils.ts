export const makeCommercialFlowId = (
  itemCd: string,
  supplierCd: string,
  companyCd: string,
) => `${itemCd}${supplierCd}${companyCd}`;
