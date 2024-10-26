const MESSAGES = {
  REQUIRED_INPUT: '${0}は必須入力です。',
  CREDENTIALS_INCORRECT: '認証情報が正しくありません。もう一度試してください。',
  EMAIL_VALIDATE: 'メールアドレスは正しい形式で入力してください。',
  EMAIL_NOT_EXIST: 'このメールアドレスのアカウントは存在しません。',
  ADDED: '追加されました。',
  REGISTERED: '登録されました。',
  UPDATED: '更新されました。',
  WAS_DELETED: '削除されました。',
  PHONE_MAXLENGTH: '電話番号は半角数字とハイフン13桁以下で入力してください。',
  PASSWORD_LENGTH:
    'パスワードは半角英数記号5桁以上50桁以下で入力してください。',
  PASSWORD_RECONFIRM:
    'パスワード再確認はパスワードと同じ値を入力してください。',
  NUMBER_DIGITS_OVERCHECK: '${0}は${1}以下で入力してください。',
  CHECK_NUMBER_DIGITS: '${0}は${1}~${2}以内で入力してください。',
  FURIGANA_CHECK: 'カタカナで入力してください',
  POSTAL_CODE_CHECK: '郵便番号は半角数字7桁で入力してください。',
  INTERGER: '整数で入力してください',
  OVER_ORDER_VOLUME:
    '発注量が足りていません。大型トラック（28㎡分）かトレーラー（48㎡分）の発注をお願いいたします。',
  MAX_INPUT: "数量は6桁以下で入力してください",
  MAX_LENGTH_MEMO: 'メモは2000以下で入力してください。',
  REGEX_USER_ID: "半角、数字、および特殊文字のみを入力できます。"
} as const;

Object.freeze(MESSAGES);

export default MESSAGES;
