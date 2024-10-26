import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { BASE_INPUT } from '@/app/constants/base.const';

export const createBaseValidationSchema = (edit?: boolean) => {

  const baseNameSchema = Yup.string()
    .required(createMessage(MESSAGES.REQUIRED_INPUT, BASE_INPUT.BASENM.LABEL))
    .max(
      BASE_INPUT.BASENM.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        BASE_INPUT.BASENM.LABEL,
        BASE_INPUT.BASENM.MAX,
      ),
    ).matches(/^(?![\s　]+$)[\S　\s]+$/, createMessage(MESSAGES.REQUIRED_INPUT, BASE_INPUT.BASENM.LABEL));

  const baseNameKanaSchema = Yup.string().max(
    BASE_INPUT.BASENMKN.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      BASE_INPUT.BASENMKN.LABEL,
      BASE_INPUT.BASENMKN.MAX,
    ),
  );

  const phoneNumberSchema = Yup.string().jpPhone(
    createMessage(MESSAGES.PHONE_MAXLENGTH, BASE_INPUT.TELNUMBER.LABEL),
  );

  const postCdSchema = Yup
  .string()
  .matches(/^[0-9]+$/, { message: '半角数字を入力してください。' })
  .transform((value, originalValue) =>
    String(originalValue).trim() === '' ? null : value
  )
  .nullable()
  .max(
    BASE_INPUT.POSTCD.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      BASE_INPUT.POSTCD.LABEL,
      BASE_INPUT.POSTCD.MAX,
    ),
  );

  const address1Schema = Yup.string()
  .nullable()
  .max(
    BASE_INPUT.ADDRESS1.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      BASE_INPUT.ADDRESS1.LABEL,
      BASE_INPUT.ADDRESS1.MAX,
    ),
  );

  const address2Schema = Yup.string()
  .nullable()
  .max(
    BASE_INPUT.ADDRESS2.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      BASE_INPUT.ADDRESS2.LABEL,
      BASE_INPUT.ADDRESS2.MAX,
    ),
  );

  const address3Schema = Yup.string()
  .nullable()
  .max(
    BASE_INPUT.ADDRESS3.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      BASE_INPUT.ADDRESS3.LABEL,
      BASE_INPUT.ADDRESS3.MAX,
    ),
  );

const companySchema = Yup.string().required(
    createMessage(MESSAGES.REQUIRED_INPUT, BASE_INPUT.COMPANYNM.LABEL),
  );

  const yupSchema: { [k: string]: any } = {
    baseName: baseNameSchema,
    baseNameKana: baseNameKanaSchema,
    companyCd: companySchema,
    telNumber: phoneNumberSchema,
    postCode: postCdSchema,
    address1: address1Schema,
    address2: address2Schema,
    address3: address3Schema,
  };

  return Yup.object(yupSchema);
};
