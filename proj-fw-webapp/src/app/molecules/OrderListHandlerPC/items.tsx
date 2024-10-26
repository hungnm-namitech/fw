import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';

export interface Status {
  id: string;
  label: string;
}
export interface ControlType {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues, any>;
}
export const statusListPC: Status[] = [
  {
    id: '1',
    label: '発注未確定',
  },
  {
    id: '2',
    label: '納期未確定​',
  },
  {
    id: '3-4',
    label: '納期回答済',
  },
  {
    id: '',
    label: '納期変更申請',
  },
  {
    id: '5',
    label: 'キャンセル申請',
  },
  {
    id: '6',
    label: 'キャンセル承認',
  },
  {
    id: '7',
    label: 'キャンセル済み',
  },
  {
    id: '8-9',
    label: '変更申請',
  },
  {
    id: '10',
    label: '納品済',
  },
];

export const statusListAdmin: Status[] = [
  {
    id: '1',
    label: '発注未確定',
  },
  {
    id: '2',
    label: '納期未確定​',
  },
  {
    id: '3',
    label: '納期回答済',
  },
  {
    id: '4',
    label: '納期変更申請',
  },
  {
    id: '5',
    label: 'キャンセル申請',
  },
  {
    id: '6',
    label: 'キャンセル承認',
  },
  {
    id: '7',
    label: 'キャンセル済み',
  },
  {
    id: '8-9',
    label: '変更申請',
  },
  {
    id: '10',
    label: '納品済',
  },
];

export const statusListSupp: Status[] = [
  {
    id: '1',
    label: '発注未確定',
  },
  {
    id: '2',
    label: '納期未確定​',
  },
  {
    id: '3-5-8',
    label: '納期回答済',
  },
  {
    id: '4',
    label: '納期変更申請',
  },
  {
    id: '',
    label: 'キャンセル申請',
  },
  {
    id: '6',
    label: 'キャンセル承認',
  },
  {
    id: '7',
    label: 'キャンセル済み',
  },
  {
    id: '9',
    label: '変更申請',
  },
  {
    id: '10',
    label: '納品済',
  },
];
