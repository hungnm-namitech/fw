import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { COMPANY_INPUT } from '@/app/constants/company.const';

export const createCompanyValidationSchema = (edit?: boolean) => {

  const companyNameSchema = Yup.string()
    .required(createMessage(MESSAGES.REQUIRED_INPUT, COMPANY_INPUT.COMPANYNAME.LABEL))
    .max(
      COMPANY_INPUT.COMPANYNAME.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.COMPANYNAME.LABEL,
        COMPANY_INPUT.COMPANYNAME.MAX,
      ),
    ).matches(/^(?![\s　]+$)[\S　\s]+$/,createMessage(MESSAGES.REQUIRED_INPUT, COMPANY_INPUT.COMPANYNAME.LABEL));

    const companyNameKanaSchema = Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .katagana(MESSAGES.FURIGANA_CHECK)
    .max(
      COMPANY_INPUT.COMPANYNAMEKANA.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.COMPANYNAMEKANA.LABEL,
        COMPANY_INPUT.COMPANYNAMEKANA.MAX,
      ),
    );

    const phoneNumberSchema = Yup.string().jpPhone(
      createMessage(MESSAGES.PHONE_MAXLENGTH, COMPANY_INPUT.TEL.LABEL),
    );
  
    const postCdSchema = Yup
    .string()
    .matches(/^[0-9]+$/, { message: '半角数字を入力してください。' })
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value
    )
    .nullable()
    .max(
      COMPANY_INPUT.POSTCD.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.POSTCD.LABEL,
        COMPANY_INPUT.POSTCD.MAX,
      ),
    );
  
    const address1Schema = Yup.string()
    .nullable()
    .max(
      COMPANY_INPUT.ADDRESS1.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.ADDRESS1.LABEL,
        COMPANY_INPUT.ADDRESS1.MAX,
      ),
    );
  
    const address2Schema = Yup.string()
    .nullable()
    .max(
      COMPANY_INPUT.ADDRESS2.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.ADDRESS2.LABEL,
        COMPANY_INPUT.ADDRESS2.MAX,
      ),
    );
  
    const address3Schema = Yup.string()
    .nullable()
    .max(
      COMPANY_INPUT.ADDRESS3.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        COMPANY_INPUT.ADDRESS3.LABEL,
        COMPANY_INPUT.ADDRESS3.MAX,
      ),
    );
  
  const yupSchema: { [k: string]: any } = {
    companyName: companyNameSchema,
    companyNameKana: companyNameKanaSchema,
    tel: phoneNumberSchema,
    postCd: postCdSchema,
    address1: address1Schema,
    address2: address2Schema,
    address3: address3Schema,
  };

  return Yup.object(yupSchema);
};
