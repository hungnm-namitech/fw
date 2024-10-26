import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { STAFF_INPUT } from '@/app/constants/staff.const';

export const createStaffValidationSchema = (edit?: boolean) => {

  const staffNameSchema = Yup.string()
    .required(createMessage(MESSAGES.REQUIRED_INPUT, STAFF_INPUT.STAFFNAME.LABEL))
    .max(
      STAFF_INPUT.STAFFNAME.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        STAFF_INPUT.STAFFNAME.LABEL,
        STAFF_INPUT.STAFFNAME.MAX,
      ),
    ).matches(/^(?![\s　]+$)[\S　\s]+$/, createMessage(MESSAGES.REQUIRED_INPUT, STAFF_INPUT.STAFFNAME.LABEL));

  const staffNameKanaSchema = Yup.string().max(
    STAFF_INPUT.STAFFNAME_PRONUNCIATION.MAX,
    createMessage(
      MESSAGES.NUMBER_DIGITS_OVERCHECK,
      STAFF_INPUT.STAFFNAME_PRONUNCIATION.LABEL,
      STAFF_INPUT.STAFFNAME_PRONUNCIATION.MAX,
    ),
  );



  const companySchema = Yup.string().required(
    createMessage(MESSAGES.REQUIRED_INPUT, STAFF_INPUT.COMPANY.LABEL),
  );

  const yupSchema: { [k: string]: any } = {
    staffName: staffNameSchema,
    staffNameKana: staffNameKanaSchema,
    companyCd: companySchema,
  };

  return Yup.object(yupSchema);
};
