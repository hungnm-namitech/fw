import Select from '@/app/components/Select';
import { ItemDetail } from '@/app/types/api-response';
import { Controller, UseFormReturn } from 'react-hook-form';
import React, { useCallback, useMemo } from 'react';
import { TextField } from '@/app/components/TextField';
import { calculateOrderVolumne } from '@/app/utils/orders';

const TR_COMMON_CLASS_NAMES = 'border-b-[1px] border-solid border-border';

export function PullDownOrderTableRow({
  productMaps,
  form,
  formId,
  products,
}: {
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
  productMaps: {
    [productCd: string]: {
      productCd: string;
      volumes: { [k: string]: number };
      quantity: number;
      productName: string;
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
  formId: string;
  products: {
    productCd: string;
    productName: string;
    volumes: { [k: string]: number };
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
  }[];
}) {
  const selectedProductId = form.watch(`products.${formId}.productId`);
  const selectedItemId = form.watch(`products.${formId}.id`);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return;
    if (!productMaps[selectedProductId]) return;

    return productMaps[selectedProductId];
  }, [selectedProductId, productMaps]);

  const itemVolume = useMemo(() => {
    if (!selectedItemId || !selectedProduct) return 0;

    return selectedProduct.volumes[selectedItemId] || 0;
  }, [selectedProduct, selectedItemId]);

  const variants = selectedProduct?.variants || [];

  const desireQuantity = form.watch(`products.${formId}.desireQuantity`);

  const totalVolume = useMemo(
    () => calculateOrderVolumne(itemVolume, +desireQuantity).toFixed(4),
    [itemVolume, selectedProduct, desireQuantity],
  );
  const handleQuantityChange = (change: number) => {
    const currentQuantity = form.getValues(`products.${formId}.desireQuantity`) || 0;
    const currentQuantityAsNumber = typeof currentQuantity === 'string' ? parseInt(currentQuantity, 10) : currentQuantity;
    const newQuantity = currentQuantityAsNumber + change;
  
    
    if (newQuantity >= 0) {
      form.setValue(`products.${formId}.desireQuantity`, newQuantity.toString());
    }
  };
  

  return (
    <tr className={TR_COMMON_CLASS_NAMES}>
      <td className="px-[5px] py-[3px] align-baseline">
        <Controller
          control={form.control}
          name={`products.${formId}.productId`}
          render={({ field }) => (
            <Select
              options={products.map(product => ({
                value: product.productCd.toString(),
                label: product.productName,
              }))}
              placeholder=""
              label=""
              {...field}
              className="py-[9px] px-[12px]"
            />
          )}
        />
      </td>
      <td className="px-[5px] py-[3px] align-baseline">
        <Controller
          control={form.control}
          name={`products.${formId}.id`}
          render={({ field, fieldState }) => (
            <Select
              options={variants.map(variant => ({
                label: `${variant.width} × ${variant.thickness} × ${variant.length}`,
                value: variant.id.toString(),
              }))}
              error={fieldState.error?.message}
              label=""
              placeholder=""
              {...field}
              disabled={!form.watch(`products.${formId}.productId`)}
              className="py-[9px] px-[12px]"
            />
          )}
        />
      </td>
      <td className="align-baseline">
        <p className="text-center">{selectedProduct?.quantity}</p>
      </td>
      <td className="px-[5px] py-[3px] align-baseline">
  <Controller
    control={form.control}
    name={`products.${formId}.desireQuantity`}
    render={({ field, fieldState }) => (
      <div className="flex items-center">
        <div className="ml-[32px] mr-[2px]">
        <TextField
         placeholder="0"
          {...field}
          disabled={!form.watch(`products.${formId}.id`)}
          error={fieldState.error?.message}
          className="text-center py-[9px] px-[12px] h-[40px]"
        />
        </div>
        <div className="flex flex-col items-center">
        <button
            type="button"
            onClick={() => handleQuantityChange(1)} 
            disabled={!form.watch(`products.${formId}.id`)}
            style={{ fontSize: '1.25em', padding: '2px'}}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)} 
            disabled={!form.watch(`products.${formId}.id`)}
            style={{ fontSize: '1.5em'}}
          >
            -
          </button>
        </div>
      </div>
    )}
  />
</td>


      <td className="align-baseline">
        <p className="text-center">{+totalVolume}</p>
      </td>
    </tr>
  );
}
