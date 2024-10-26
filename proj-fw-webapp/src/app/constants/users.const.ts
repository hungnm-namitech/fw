export const USER_INPUT = {
  USERNAME: {
    MAX: 128,
    LABEL: 'ユーザー名',
  },
  USERNAME_PRONUNCIATION: {
    MAX: 128,
    LABEL: 'ユーザー名（フリガナ）',
  },
  COMPANY: {
    LABEL: '会社名',
  },
  AUTHORITY: {
    LABEL: '権限',
  },
  PHONE_NUMBER: {
    LABEL: '電話番号',
  },
  EMAIL: {
    LABEL: 'メールアドレス',
    MAX: 256,
  },
  PASSWORD: {
    LABEL: 'パスワード',
    MIN: 5,
    MAX: 50,
  },
  PASSWORD_CONFIRMATION: {
    LABEL: 'パスワード（確認)',
    MIN: 5,
    MAX: 50,
  },
  LOG_IN_ID: {
    LABEL: 'ログインID',
    MIN: 5,
    MAX: 50,
    REGEX: /^[a-zA-Z0-9`~!@#$%^&*()_+-={}\[\]:;"'<>,.?/\\|]+$/
  },
};

export enum USER_ROLE {
  ADMIN = 1,
  PC,
  FW,
  SUPPLIER,
}
