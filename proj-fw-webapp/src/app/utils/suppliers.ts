import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { SUPPLIER_INPUT } from '@/app/constants/supplier.const';
import { number } from 'yup';

export const createSupplierValidationSchema = (edit?: boolean) => {

  const supplierNameSchema = Yup.string()
    .required(createMessage(MESSAGES.REQUIRED_INPUT, SUPPLIER_INPUT.SUPPLIERNAME.LABEL))
    .max(
      SUPPLIER_INPUT.SUPPLIERNAME.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.SUPPLIERNAME.LABEL,
        SUPPLIER_INPUT.SUPPLIERNAME.MAX,
      ),
    ).matches(/^(?![\s　]+$)[\S　\s]+$/,createMessage(MESSAGES.REQUIRED_INPUT, SUPPLIER_INPUT.SUPPLIERNAME.LABEL));

    const supplierNameKanaSchema = Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .katagana(MESSAGES.FURIGANA_CHECK)
    .max(
      SUPPLIER_INPUT.SUPPLIERNAMEKANA.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.SUPPLIERNAMEKANA.LABEL,
        SUPPLIER_INPUT.SUPPLIERNAMEKANA.MAX,
      ),
    );

    const phoneNumberSchema = Yup.string().jpPhone(
      createMessage(MESSAGES.PHONE_MAXLENGTH, SUPPLIER_INPUT.TEL.LABEL),
    );
  
    const postCdSchema = Yup
    .string()
    .matches(/^[0-9]+$/, { message: '半角数字を入力してください。' })
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value
    )
    .nullable()
    .max(
      SUPPLIER_INPUT.POSTCODE.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.POSTCODE.LABEL,
        SUPPLIER_INPUT.POSTCODE.MAX,
      ),
    );
  
    const address1Schema = Yup.string()
    .nullable()
    .max(
      SUPPLIER_INPUT.ADDRESS1.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.ADDRESS1.LABEL,
        SUPPLIER_INPUT.ADDRESS1.MAX,
      ),
    );
  
    const address2Schema = Yup.string()
    .nullable()
    .max(
      SUPPLIER_INPUT.ADDRESS2.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.ADDRESS2.LABEL,
        SUPPLIER_INPUT.ADDRESS2.MAX,
      ),
    );
  
    const address3Schema = Yup.string()
    .nullable()
    .max(
      SUPPLIER_INPUT.ADDRESS3.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        SUPPLIER_INPUT.ADDRESS3.LABEL,
        SUPPLIER_INPUT.ADDRESS3.MAX,
      ),
    );
  
    const yupSchema: { [k: string]: any } = {
    supplierName: supplierNameSchema,
    supplierNameKana: supplierNameKanaSchema,
    tel: phoneNumberSchema,
    postCd: postCdSchema,
    address1: address1Schema,
    address2: address2Schema,
    address3: address3Schema,
  };

  return Yup.object(yupSchema);
};
