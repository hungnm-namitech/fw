import { createMessage } from '@/lib/utilities';
import Yup from '@/app/yup.global';
import MESSAGES from '@/lib/messages';
import { USER_INPUT } from '@/app/constants/users.const';
import { USER_ROLE } from '@/lib/constants';

export const createUserValidationSchema = (edit?: boolean) => {
  const MIN_MAX_LOGIN_ID_MESSSAGE = createMessage(
    MESSAGES.CHECK_NUMBER_DIGITS,
    USER_INPUT.LOG_IN_ID.LABEL,
    USER_INPUT.LOG_IN_ID.MIN,
    USER_INPUT.LOG_IN_ID.MAX,
  );

  const MIN_MAX_PASSWORD_CONIRM_MESSSAGE = createMessage(
    MESSAGES.CHECK_NUMBER_DIGITS,
    USER_INPUT.PASSWORD_CONFIRMATION.LABEL,
    USER_INPUT.PASSWORD_CONFIRMATION.MIN,
    USER_INPUT.PASSWORD_CONFIRMATION.MAX,
  );

  const usernameSchema = Yup.string()
    .required(createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.USERNAME.LABEL))
    .max(
      USER_INPUT.USERNAME.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        USER_INPUT.USERNAME.LABEL,
        USER_INPUT.USERNAME.MAX,
      ),
    ).matches(/^(?![\s　]+$)[\S　\s]+$/, createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.USERNAME.LABEL));

  const usernamePronunciationSchema = Yup.string()
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .katagana(MESSAGES.FURIGANA_CHECK)
    .max(
      USER_INPUT.USERNAME_PRONUNCIATION.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        USER_INPUT.USERNAME_PRONUNCIATION.LABEL,
        USER_INPUT.USERNAME_PRONUNCIATION.MAX,
      ),
    );

  const companySchema = Yup.string().when('authority', {
    then: schema =>
      schema.required(
        createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.COMPANY.LABEL),
      ),

    is: (role: number) =>
      +role === USER_ROLE.PC || +role === USER_ROLE.SUPPLIER,
  });

  const authoritySchema = Yup.string().required(
    createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.AUTHORITY.LABEL),
  );

  const phoneNumberSchema = Yup.string().jpPhone(
    createMessage(MESSAGES.PHONE_MAXLENGTH, USER_INPUT.PHONE_NUMBER.LABEL),
  );

  const emailSchema = Yup.string()
    .when('authority', {
      is: USER_ROLE.ADMIN.toString(),
      then: schema =>
        schema.required(
          createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.EMAIL.LABEL),
        ),
    })
    .nullable()
    .transform((v, o) => (o === '' ? null : v))
    .email(MESSAGES.EMAIL_VALIDATE)
    .noNumberDomain(MESSAGES.EMAIL_VALIDATE)
    .max(
      USER_INPUT.EMAIL.MAX,
      createMessage(MESSAGES.NUMBER_DIGITS_OVERCHECK, USER_INPUT.EMAIL.LABEL, USER_INPUT.EMAIL.MAX),
    );

  const passwordConfirmationSchema = Yup.string()
    .required(
      createMessage(
        MESSAGES.REQUIRED_INPUT,
        USER_INPUT.PASSWORD_CONFIRMATION.LABEL,
      ),
    )
    .passwordCheck(
      createMessage(
        MESSAGES.PASSWORD_LENGTH,
        USER_INPUT.PASSWORD_CONFIRMATION.LABEL,
      ),
    )
    .min(USER_INPUT.PASSWORD_CONFIRMATION.MIN, MIN_MAX_PASSWORD_CONIRM_MESSSAGE)
    .max(USER_INPUT.PASSWORD_CONFIRMATION.MAX, MIN_MAX_PASSWORD_CONIRM_MESSSAGE)
    .equals([Yup.ref('password')], MESSAGES.PASSWORD_RECONFIRM);

  const passwordSchema = Yup.string()

    .required(createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.PASSWORD.LABEL))
    .passwordCheck(
      createMessage(MESSAGES.PASSWORD_LENGTH, USER_INPUT.PASSWORD.LABEL),
    )
    .min(USER_INPUT.PASSWORD.MIN, MESSAGES.PASSWORD_LENGTH)
    .max(USER_INPUT.PASSWORD.MAX, MESSAGES.PASSWORD_LENGTH)
    .halfwidth(MESSAGES.PASSWORD_LENGTH);

  const logInIdSchema = Yup.string()
    .transform((v, o) => (o === '' ? null : v))
    .required(
      createMessage(MESSAGES.REQUIRED_INPUT, USER_INPUT.LOG_IN_ID.LABEL),
    )
    .min(USER_INPUT.LOG_IN_ID.MIN, MIN_MAX_LOGIN_ID_MESSSAGE)
    .max(USER_INPUT.LOG_IN_ID.MAX, MIN_MAX_LOGIN_ID_MESSSAGE)
    .matches(USER_INPUT.LOG_IN_ID.REGEX, MESSAGES.REGEX_USER_ID)

  const yupSchema: { [k: string]: any } = {
    username: usernameSchema,
    usernamePronunciation: usernamePronunciationSchema,
    company: companySchema,
    authority: authoritySchema,
    phoneNumber: phoneNumberSchema,
    email: emailSchema,
  };

  if (!edit) {
    yupSchema.logInId = logInIdSchema;
    yupSchema.password = passwordSchema;

    yupSchema.passwordConfirmation = passwordConfirmationSchema;
  }

  return Yup.object(yupSchema);
};
