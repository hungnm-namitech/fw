import { Type } from '@nestjs/common';
import { OrderAction } from '@prisma/client';
import { USER_ROLE } from 'src/constants/common';

export enum MIXED_LOADING_FLAG {
  NO,
  YES,
}

export enum ORDER_STATUS_DIV {
  ORDER_NOT_CONFIRM = 1,
  DELIVERY_DATE_UNDETERMINED,
  DELIVERY_DATE_CONFIRMED,
  DELIVERY_DATE_CHANGE_REQUEST,
  CANCELLATION_REQUEST,
  CANCELLATION_APPROVED,
  CANCELED,
  CHANGE_REQUEST,
  CHANGE_DELIVERY_DATE_UNCONFIRMED,
  DELIVERED,
}
export enum ORDER_ACTION_DIV {
  ORDER_CONFIRMATION = 1,
  APPROVAL,
  REJECTION,
  DELIVERY_DATE_RESPONSE,
  DELIVERY_DATE_CHANGE,
  DELIVERY_DATE_CHANGE_APPROVAL,
  DELIVERY_DATE_CHANGE_REJECTION,
  CANCELLATION,
  CANCELLATION_APPROVAL_BY_FW,
  CANCELLATION_APPROVAL_BY_SUPPLIER,
  CANCELLATION_REJECTION_BY_FW,
  CANCELLATION_REJECTION_BY_SUPPLIER,
  ORDER_CHANGE,
  ORDER_CHANGE_APPROVAL_BY_FW,
  ORDER_CHANGE_APPROVAL_BY_SUPPLIER,
  ORDER_CHANGE_REJECTION_BY_FW,
  ORDER_CHANGE_REJECTION_BY_SUPPLIER,
  COMPLETE_DELIVERY,
}

export const ACTIONS_NEED_CHECKING_READ_FOR_PC = [
  ORDER_ACTION_DIV.REJECTION,
  ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE,
  ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_APPROVAL,
  ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_SUPPLIER,
  ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_FW,
  ORDER_ACTION_DIV.CANCELLATION_REJECTION_BY_SUPPLIER,
  ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_SUPPLIER,
  ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_FW,
  ORDER_ACTION_DIV.ORDER_CHANGE_REJECTION_BY_SUPPLIER,
];

export const ACTIONS_NEED_CHECKING_READ_FOR_FW = [
  ORDER_ACTION_DIV.ORDER_CONFIRMATION,
  ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE,
  ORDER_ACTION_DIV.ORDER_CHANGE,
  ORDER_ACTION_DIV.CANCELLATION,
];

export const ACTIONS_NEED_CHECKING_READ_FOR_SUPPLIER = [
  ORDER_ACTION_DIV.APPROVAL,
  ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE_REJECTION,
  ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW,
  ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW,
];

export enum ORDER_ACTION_CONFIRMATION {
  ACCEPT = 'Accept',
  REFUSE = 'Refuse',
}

export enum ORDER_VALIDATION_REQUEST {
  CONFIRM_CREATE_ORDER = 'confirmCreateOrder',
  CONFIRM_DELIVERY_DATE_CHANGE = 'confirmDeliveryDateChange',
  CONFIRM_CANCELLATION_REQUEST = 'confirmCancellationRequest',
  CONFIRM_CHANGE_ORDER = 'confirmChangeOrder',
}

export type DEFAULT_ORDER_ACTION = Pick<
  OrderAction,
  'closeFlag' | 'orderHeaderId' | 'memo' | 'confirmedFlag' | 'companyName'
>;

export const MAPPING_ACTION_VALIDATION_REQUEST_WITH_ACTION_STATUS = {
  [ORDER_VALIDATION_REQUEST.CONFIRM_CREATE_ORDER]: [
    {
      actionBy: [USER_ROLE.FW, USER_ROLE.ADMIN],
      actionDiv: [ORDER_ACTION_DIV.ORDER_CONFIRMATION],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
    {
      actionBy: [USER_ROLE.SUPPLIER],
      actionDiv: [
        ORDER_ACTION_DIV.ORDER_CONFIRMATION,
        ORDER_ACTION_DIV.APPROVAL,
      ],
      action: ORDER_ACTION_CONFIRMATION.ACCEPT,
    },
  ],
  [ORDER_VALIDATION_REQUEST.CONFIRM_DELIVERY_DATE_CHANGE]: [
    {
      actionBy: [USER_ROLE.FW, USER_ROLE.ADMIN],
      actionDiv: [ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE],
      action: ORDER_ACTION_CONFIRMATION.ACCEPT,
    },
    {
      actionBy: [USER_ROLE.FW, USER_ROLE.ADMIN],
      actionDiv: [ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
  ],
  [ORDER_VALIDATION_REQUEST.CONFIRM_CANCELLATION_REQUEST]: [
    {
      actionBy: [USER_ROLE.FW, USER_ROLE.ADMIN],
      actionDiv: [ORDER_ACTION_DIV.CANCELLATION],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
    {
      actionBy: [USER_ROLE.SUPPLIER],
      actionDiv: [
        ORDER_ACTION_DIV.CANCELLATION,
        ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW,
      ],
      action: ORDER_ACTION_CONFIRMATION.ACCEPT,
    },
    {
      actionBy: [USER_ROLE.SUPPLIER],
      actionDiv: [
        ORDER_ACTION_DIV.CANCELLATION,
        ORDER_ACTION_DIV.CANCELLATION_APPROVAL_BY_FW,
      ],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
  ],
  [ORDER_VALIDATION_REQUEST.CONFIRM_CHANGE_ORDER]: [
    {
      actionBy: [USER_ROLE.FW, USER_ROLE.ADMIN],
      actionDiv: [ORDER_ACTION_DIV.ORDER_CHANGE],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
    {
      actionBy: [USER_ROLE.SUPPLIER],
      actionDiv: [
        ORDER_ACTION_DIV.ORDER_CHANGE,
        ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW,
      ],
      action: ORDER_ACTION_CONFIRMATION.REFUSE,
    },
    {
      actionBy: [USER_ROLE.SUPPLIER],
      actionDiv: [
        ORDER_ACTION_DIV.ORDER_CHANGE,
        ORDER_ACTION_DIV.ORDER_CHANGE_APPROVAL_BY_FW,
      ],
      action: ORDER_ACTION_CONFIRMATION.ACCEPT,
    },
  ],
};

export const FIELDS_REQUIRED_IF_ORDER_NOT_DRAF = [
  'requestedDeadline',
  'staffId',
  'mixedLoadingFlag',
  'destinationId',
  'vehicleClassDiv',
];

export enum ORDER_HEADER_ORDER_BY {
  ORDER_ID = 'id',
  ITEM_NAME = 'itemName',
  IS_READ = 'isRead',
  STATUS_DIV = 'statusDiv',
  ACTION_DIV = 'action',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  UPDATED_BY = 'changer',
  REQUESTED_DEADLINE = 'requestedDeadline',
  REPLY_DEADLINE = 'replyDeadline',
  MEMO = 'memo',
  ORDER_QUANTITY = 'orderQuantity',
  MIXED_LOADING_FLAG = 'mixedLoadingFlag',
  DESTINATION_ID = 'destinationId',
}

export const MAP_ORDER_HEADER_ORDER_BY: {
  [key: string]: { field: string; type: Type };
} = {
  [ORDER_HEADER_ORDER_BY.ORDER_ID]: {
    field: 'id',
    type: Number,
  },
  [ORDER_HEADER_ORDER_BY.ITEM_NAME]: {
    field: 'itemName',
    type: String,
  },
  [ORDER_HEADER_ORDER_BY.IS_READ]: {
    field: 'isRead',
    type: Boolean,
  },
  [ORDER_HEADER_ORDER_BY.STATUS_DIV]: {
    field: 'statusDiv',
    type: Number,
  },
  [ORDER_HEADER_ORDER_BY.ACTION_DIV]: {
    field: 'actionDiv',
    type: Number,
  },
  [ORDER_HEADER_ORDER_BY.CREATED_AT]: {
    field: 'createdAt',
    type: Date,
  },
  [ORDER_HEADER_ORDER_BY.UPDATED_AT]: {
    field: 'updatedAt',
    type: Date,
  },
  [ORDER_HEADER_ORDER_BY.UPDATED_BY]: {
    field: 'updatedByUserName',
    type: String,
  },
  [ORDER_HEADER_ORDER_BY.REQUESTED_DEADLINE]: {
    field: 'requestedDeadline',
    type: Date,
  },
  [ORDER_HEADER_ORDER_BY.REPLY_DEADLINE]: {
    field: 'replyDeadline',
    type: Date,
  },
  [ORDER_HEADER_ORDER_BY.MEMO]: {
    field: 'memo',
    type: String,
  },
  [ORDER_HEADER_ORDER_BY.DESTINATION_ID]: {
    field: 'destinationId',
    type: Number,
  },
  [ORDER_HEADER_ORDER_BY.MIXED_LOADING_FLAG]: {
    field: 'mixedLoadingFlag',
    type: Boolean,
  },
  [ORDER_HEADER_ORDER_BY.ORDER_QUANTITY]: {
    field: 'orderQuantity',
    type: Number,
  },
};