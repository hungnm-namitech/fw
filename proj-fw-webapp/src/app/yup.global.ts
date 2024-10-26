import * as Yup from 'yup';

Yup.addMethod(Yup.string, 'digitsOnly', function (message: string) {
  return this.matches(/\d+/, message);
});
Yup.addMethod(Yup.string, 'jpPhone', function (message) {
  const JP_PHONE_REGEX = /^(?=(?:\d{1,4}-){2}\d{1,5}$)[\d-]{1,13}$/;
  return this.matches(JP_PHONE_REGEX, { message, excludeEmptyString: true });
});

Yup.addMethod(Yup.string, 'passwordCheck', function (message) {
  const ALPHA_NUMBERIC_PASSWORD = /^(\w|\W|\d)+$/;
  return this.matches(ALPHA_NUMBERIC_PASSWORD, {
    message,
    excludeEmptyString: true,
  });
});

Yup.addMethod(Yup.string, 'noNumberDomain', function (message) {
  const NO_NUMBER_DOMAIN = /\S+@([A-Za-z0-9.-]+\.){1}[A-Za-z]{2,}$/;
  return this.matches(NO_NUMBER_DOMAIN, {
    message,
  });
});

Yup.addMethod(Yup.string, 'katagana', function (message) {
  const KATAGANA = /^([ァ-ン]|ー)+$/;
  return this.matches(KATAGANA, {
    message,
  });
});

Yup.addMethod(Yup.string, 'halfwidth', function (message) {
  const HAFLWIDTH = /[\u0020-\u007E\uFF61-\uFF9F]/g;
  return this.matches(HAFLWIDTH, {
    message,
  });
});

declare module 'yup' {
  interface StringSchema {
    digitsOnly(message: string): StringSchema;
    jpPhone(message: string): StringSchema;
    passwordCheck(message: string): StringSchema;
    passwordCheck(message: string): StringSchema;
    noNumberDomain(message: string): StringSchema;
    katagana(message: string): StringSchema;
    halfwidth(message: string): StringSchema;
  }
}

export default Yup;
