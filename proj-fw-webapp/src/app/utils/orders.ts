import MESSAGES from '@/lib/messages';
import Yup from '../yup.global';
import { createMessage } from '@/lib/utilities';
import { ORDER_INPUT } from '../constants/orders.const';
import { ItemDetail } from '../types/api-response';
import { ObjectShape } from 'yup';
import { createHash } from 'crypto';
import { ORDER_ACTION_DIV, ORDER_STATUS_DIV } from '@/lib/constants';
import { OrderProductDetail } from '../types/entities';
import { PulldownNewEntry, TabularNewEntry } from '../types/orders';
import moment from 'moment';
import * as XLSX from 'xlsx';
import React from 'react';
import { USER_ROLE } from '../constants/users.const';

export function makeTabularCreateOrderEntrySchema(
  item?: (Pick<ItemDetail, 'thickness' | 'quantityPerPack'> & {
    hashedId: string;
    variantIds: {
      [lengthId: string]: string;
    };
  })[],
  temporary: boolean = true,
) {
  const itemsSchema: ObjectShape = {};

  if (item) {
    item.forEach(({ variantIds }) => {
      Object.values(variantIds).forEach(id => {
        itemsSchema[id] = Yup.number()
          .transform((_, value) => (typeof +value === 'number' ? +value : null))
          .integer(MESSAGES.INTERGER)
          .typeError(MESSAGES.INTERGER)
          .min(0, MESSAGES.INTERGER)
          .max(999999, MESSAGES.MAX_INPUT);
      });
    });
  }

  let deliveryDateSchema = Yup.date();
  let managerSchema = Yup.string();
  let transportVehicleSchema = Yup.string();
  let locationSchema = Yup.string();

  if (!temporary) {
    deliveryDateSchema = deliveryDateSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '納品する日付'));
    managerSchema = managerSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '担当者'));
    transportVehicleSchema = transportVehicleSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '車格'));
    locationSchema = locationSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '降ろし先'));
  }

  return Yup.object({
    deliveryDate: deliveryDateSchema,
    manager: managerSchema,
    transportVehicle: transportVehicleSchema,
    location: locationSchema,
    notice: Yup.string().max(
      ORDER_INPUT.NOTICE.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        ORDER_INPUT.NOTICE.LABEL,
        ORDER_INPUT.NOTICE.MAX,
      ),
    ),
    items: Yup.object(itemsSchema),
  });
}

export function makePullDownCreateOrderEntrySchema(
  products?: {
    [randomKey: string]: {
      id: string | undefined;
      productId: string | undefined;
      desireQuantity: string;
    };
  },
  temporary: boolean = true,
) {
  const itemsSchema: ObjectShape = {};

  Object.keys(products || {}).forEach(key => {
    itemsSchema[key] = Yup.object({
      id: Yup.string().when(`productId`, {
        is: (value: any) => !!value,
        then: schema =>
          schema.required(createMessage(MESSAGES.REQUIRED_INPUT, 'サイズ')),
      }),
      desireQuantity: Yup.number()
        .transform((_, value) => {
          if (value.trim() === '') return null;
          return typeof +value === 'number' && +value !== 0 ? +value : null;
        })
        .when(`productId`, {
          is: (value: any) => !!value,
          then: schema =>
            schema
              .integer(MESSAGES.INTERGER)
              .min(0, createMessage(MESSAGES.REQUIRED_INPUT, '量'))
              .max(999999, createMessage(MESSAGES.MAX_INPUT))
              .required(createMessage(MESSAGES.REQUIRED_INPUT, '量'))
              .typeError(MESSAGES.INTERGER),
          otherwise: schema => schema.nullable(),
        }),
    });
  });

  let deliveryDateSchema = Yup.date();
  let managerSchema = Yup.string();
  let transportVehicleSchema = Yup.string();
  let locationSchema = Yup.string();

  if (!temporary) {
    deliveryDateSchema = deliveryDateSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '納品する日付'));
    managerSchema = managerSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '担当者'));
    transportVehicleSchema = transportVehicleSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '車格'));
    locationSchema = locationSchema
      .transform(value => (!!value ? value : null))
      .required(createMessage(MESSAGES.REQUIRED_INPUT, '降ろし先'));
  }

  return Yup.object({
    deliveryDate: deliveryDateSchema,
    manager: managerSchema,
    transportVehicle: transportVehicleSchema,
    location: locationSchema,
    notice: Yup.string().max(
      ORDER_INPUT.NOTICE.MAX,
      createMessage(
        MESSAGES.NUMBER_DIGITS_OVERCHECK,
        ORDER_INPUT.NOTICE.LABEL,
        ORDER_INPUT.NOTICE.MAX,
      ),
    ),
    products: Yup.object(itemsSchema),
  });
}

export const makeUniqueItemProductId = (
  itemDetail: Pick<ItemDetail, 'productId' | 'quantityPerPack' | 'thickness'>,
) => {
  return createHash('sha256')
    .update(`${itemDetail.quantityPerPack}_${itemDetail.thickness}`)
    .digest('hex');
};

export const formatTabularItemDetails: (itemDetail: ItemDetail[]) => {
  error: boolean;
  data: {
    lengths: string[];
    width: number;
    grouppedItems: (Pick<ItemDetail, 'thickness' | 'quantityPerPack'> & {
      hashedId: string;
      variantIds: { [lengthId: string]: string };
      volumes: { [lengthId: string]: number };
    })[];
  };
} = (itemDetail: ItemDetail[]) => {
  if (itemDetail.length === 0)
    return {
      error: false,
      data: { lengths: [], width: 0, grouppedItems: [] },
    };

  const referenceWidth = itemDetail[0].width;

  const grouppedItems: {
    [id: string]: Pick<
      ItemDetail,
      'thickness' | 'quantityPerPack' | 'itemVolume'
    > & {
      hashedId: string;
      variantIds: { [lengthId: string]: string };
      volumes: { [lengthId: string]: number };
    };
  } = {};

  const lengths: { [length: number]: true } = {};

  for (let i = 0; i < itemDetail.length; i++) {
    // if (referenceProductId !== itemDetail[i].productId) {
    //   console.error(
    //     'Item productId is not valid!',
    //     referenceWidth,
    //     itemDetail[i].productId,
    //   );
    //   return {
    //     error: true,
    //     data: { lengths: [], width: 0, grouppedItems: [] },
    //   };
    // }

    if (referenceWidth !== itemDetail[i].width) {
      console.error(
        'Item width is not valid!',
        referenceWidth,
        itemDetail[i].width,
      );

      return {
        error: true,
        data: { lengths: [], width: 0, grouppedItems: [] },
      };
    }
    const id = makeUniqueItemProductId(itemDetail[i]);

    if (!grouppedItems[id])
      grouppedItems[id] = {
        hashedId: id,
        thickness: itemDetail[i].thickness,
        variantIds: {},
        quantityPerPack: itemDetail[i].quantityPerPack,
        itemVolume: itemDetail[i].itemVolume,
        volumes: {},
      };

    const length = itemDetail[i].length;

    grouppedItems[id].variantIds[length] = itemDetail[i].id.toString();
    grouppedItems[id].volumes[length] = itemDetail[i].itemVolume;

    lengths[itemDetail[i].length] = true;
  }

  // if (
  //   !Object.keys(grouppedItems).every(
  //     key =>
  //       Object.keys(grouppedItems[key].variantIds).length ===
  //       Object.keys(lengths).length,
  //   )
  // ) {
  //   console.error('Item lengths do not match!');

  //   return {
  //     error: true,
  //     data: { lengths: [], width: 0, grouppedItems: [] },
  //   };
  // }

  return {
    error: false,
    data: {
      lengths: Object.keys(lengths),
      width: referenceWidth,
      grouppedItems: Object.values(grouppedItems),
    },
  };
};

export const formatPulldownItemDetails: (itemDetail: ItemDetail[]) => {
  error: boolean;
  data: {
    [productCd: string]: {
      productCd: string;
      productName: string;
      volumes: { [k: string]: number };
      quantity: number;
      variants: Pick<
        ItemDetail,
        | 'itemVolume'
        | 'quantityPerPack'
        | 'thickness'
        | 'unitPrice'
        | 'width'
        | 'length'
        | 'id'
      >[];
    };
  };
} = (itemDetail: ItemDetail[]) => {
  if (itemDetail.length === 0)
    return {
      error: false,
      data: {},
    };

  const formattedData: {
    [productCd: string]: {
      productCd: string;
      productName: string;
      volumes: { [k: string]: number };
      quantity: number;
      variants: Pick<
        ItemDetail,
        | 'itemVolume'
        | 'quantityPerPack'
        | 'thickness'
        | 'unitPrice'
        | 'width'
        | 'length'
        | 'id'
      >[];
    };
  } = {};

  for (let i = 0; i < itemDetail.length; i++) {
    const item = itemDetail[i];
    if (!formattedData[item.productCd])
      formattedData[item.productCd] = {
        productCd: item.productCd.toString(),
        productName: item.productName,
        variants: [],
        quantity: item.quantityPerPack,
        volumes: {},
      };

    formattedData[item.productCd].variants.push(item);
    formattedData[item.productCd].volumes[item.id] = item.itemVolume;
  }

  return {
    data: formattedData,
    error: false,
  };
};

export function getPulldownTotalVolume(
  products: {
    [productCd: string]: {
      productCd: string;
      volumes: { [k: string]: number };

      quantity: number;
      productName: string;
      variants: Pick<
        ItemDetail,
        | 'itemVolume'
        | 'quantityPerPack'
        | 'thickness'
        | 'unitPrice'
        | 'width'
        | 'length'
        | 'id'
      >[];
    };
  },
  productForms: {
    [randomKey: string]: {
      id: string | undefined;
      productId: string | undefined;
      desireQuantity: string;
    };
  },
) {
  let total = 0;

  Object.values(productForms).forEach(productForm => {
    const product = products[productForm.productId || ''];
    const volume =
      productForm.id && product?.volumes ? product.volumes[productForm.id] : 0;

    if (product) {
      total += volume * +productForm.desireQuantity;
    }
  });

  return +total.toFixed(4);
}

export const getTextAction = (statusDiv: ORDER_STATUS_DIV) => {
  switch (+statusDiv) {
    case ORDER_ACTION_DIV.APPROVAL:
      return '承認';

    case ORDER_ACTION_DIV.CANCELLATION:
      return 'キャンセル';

    case ORDER_ACTION_DIV.ORDER_CHANGE:
    case ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE:
      return '発注変更';

    case ORDER_ACTION_DIV.DELIVERY_DATE_CHANGE:
      return '納期変更';

    case ORDER_ACTION_DIV.REJECTION:
      return '否決';

    case ORDER_ACTION_DIV.DELIVERY_DATE_RESPONSE:
      return '納期回答';

    default:
      return '-';
  }
};

export const calculateOrderVolumne = (
  itemVolume: number,
  desireQuantity: number,
) => itemVolume * desireQuantity;

export const calculateTotalQuantityPerPack = (
  products: Pick<OrderProductDetail, 'desireQuantity' | 'quantityPerPack'>[],
) =>
  products.reduce(
    (total, pDetail) =>
      (total += pDetail.quantityPerPack * pDetail.desireQuantity),
    0,
  );
export const getBgStatus = (statusDiv: ORDER_STATUS_DIV) => {
  switch (statusDiv) {
    case ORDER_STATUS_DIV.ORDER_NOT_CONFIRM:
      return '#CCFFFF';
    case ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED:
      return '#CCFFCC';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST:
      return '#FFFFCC';
    case ORDER_STATUS_DIV.CHANGE_REQUEST:
      return '#FFE5CC';
    case ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED:
      return '#FFE5CC';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED:
      return '#3C6255';
    case ORDER_STATUS_DIV.DELIVERED:
      return '#1f332c';
    case ORDER_STATUS_DIV.CANCELLATION_REQUEST:
      return '#eeeeee';
    case ORDER_STATUS_DIV.CANCELLATION_APPROVED:
      return '#8f8f8f';
    case ORDER_STATUS_DIV.CANCELED:
      return '#424242';
    default:
      return '#CCFFFF';
  }
};
export const getTextColorStatus = (statusDiv: ORDER_STATUS_DIV) => {
  switch (statusDiv) {
    case ORDER_STATUS_DIV.ORDER_NOT_CONFIRM:
      return '[#171717]';
    case ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED:
      return '[#171717]';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST:
      return '[#171717]';
    case ORDER_STATUS_DIV.CHANGE_REQUEST:
      return '[#171717]';
    case ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED:
      return '[#171717]';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED:
      return 'white';
    case ORDER_STATUS_DIV.DELIVERED:
      return 'white';
    case ORDER_STATUS_DIV.CANCELLATION_REQUEST:
      return '[#171717]';
    case ORDER_STATUS_DIV.CANCELLATION_APPROVED:
      return '[#171717]';
    case ORDER_STATUS_DIV.CANCELED:
      return '#FFFFFF';
    default:
      return '[#171717]';
  }
};
export const getTextStatus = (statusDiv: ORDER_STATUS_DIV) => {
  switch (statusDiv) {
    case ORDER_STATUS_DIV.ORDER_NOT_CONFIRM:
      return '発注未確定';
    case ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED:
      return '納期未確定';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST:
      return '納期変更申請';
    case ORDER_STATUS_DIV.CHANGE_REQUEST:
      return '#変更申請';
    case ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED:
      return '#変更申請';
    case ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED:
      return '納期回答済';
    case ORDER_STATUS_DIV.DELIVERED:
      return '納品済';
    case ORDER_STATUS_DIV.CANCELLATION_REQUEST:
      return 'キャンセル申請';
    case ORDER_STATUS_DIV.CANCELLATION_APPROVED:
      return 'キャンセル承認';
    case ORDER_STATUS_DIV.CANCELED:
      return 'キャンセル済み';
    default:
      return '発注未確定';
  }
};

export const warningReply = (
  replyDeadline: string,
  statusDiv: number,
  role: USER_ROLE,
) => {
  if (!replyDeadline) return false;
  const today = moment(new Date());
  const replyDeadlineDate = new Date(replyDeadline);
  if (
    role === USER_ROLE.PC &&
    today.isAfter(replyDeadlineDate) &&
    statusDiv !== ORDER_STATUS_DIV.DELIVERED
  ) {
    return true;
  }
  return false;
};

export const formatItemDetails = (
  data: {
    items: {
      [productId: string]: {
        id: string | undefined;
        desireQuantity: string;
      }[];
    };
  } & (Omit<TabularNewEntry, 'items'> | PulldownNewEntry),
) => {
  const itemDetails: {
    [id: string]: { itemDetailId: string; quantity: number };
  } = {};

  Object.values(data.items).forEach(iDetails => {
    iDetails.forEach(iDetail => {
      if (!iDetail.id) return;
      if (!itemDetails[iDetail.id || '']) {
        itemDetails[iDetail.id || ''] = {
          itemDetailId: iDetail.id || '',
          quantity: +(iDetail.desireQuantity || ''),
        };
      } else {
        itemDetails[iDetail.id || ''].quantity += +iDetail.desireQuantity;
      }
    });
  });

  return itemDetails;
};

export function makePulldownInputId(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const getUpdateOrderStatusDiv = (
  currentStatusDiv: number,
  draftFlag: boolean,
  isDraft: boolean,
) => {
  if (
    draftFlag &&
    currentStatusDiv === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM &&
    isDraft
  )
    return ORDER_STATUS_DIV.ORDER_NOT_CONFIRM;

  if (!draftFlag && !isDraft) {
    if (
      [
        ORDER_STATUS_DIV.ORDER_NOT_CONFIRM,
        ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED,
        ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED,
        ORDER_STATUS_DIV.CHANGE_REQUEST,
        ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST,
      ].indexOf(currentStatusDiv) !== -1
    )
      return ORDER_STATUS_DIV.CHANGE_REQUEST;
  }

  return currentStatusDiv;
};

export const formatInputCsvItemDetails = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const files = e.target.files;

  let rows: {
    id: string;
    productName: string;
    width: number;
    thickness: number;
    length: number;
    quantityPerPack: number;
    gradeStrength: string;
    desireQuantity: number;
  }[] = [];

  if (files && files[0]) {
    const file = files[0];

    const arrayBuffer = await file.arrayBuffer();

    const wb = XLSX.read(arrayBuffer, {
      type: 'array',
      codepage: 65001,
    });
    wb.SheetNames.forEach((n, idx) => {
      const ws = wb.Sheets[n];
      rows = XLSX.utils.sheet_to_json(ws, {
        header: [
          'id',
          'productName',
          'width',
          'thickness',
          'length',
          'quantityPerPack',
          'gradeStrength',
          'desireQuantity',
        ],
        rawNumbers: true,
        blankrows: false,
        raw: true,
        skipHidden: true,
      });
    });
  }

  if (rows.length) {
    rows.splice(0, 1);
  }

  return rows;
};

export const checkActiveApprovalOrdDetail = (
  statusOrder: ORDER_STATUS_DIV,
  role: USER_ROLE,
) => {
  switch (role) {
    case USER_ROLE.PC:
      return true;
    case USER_ROLE.FW:
    case USER_ROLE.ADMIN:
      if (
        statusOrder === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST ||
        statusOrder === ORDER_STATUS_DIV.CANCELLATION_REQUEST ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_REQUEST
      )
        return true;
      return false;
    case USER_ROLE.SUPPLIER:
      if (
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED ||
        statusOrder === ORDER_STATUS_DIV.CANCELLATION_APPROVED ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED
      )
        return true;
      return false;
  }
};

export const checkActiveRejectionOrdDetail = (
  statusOrder: ORDER_STATUS_DIV,
  role: USER_ROLE,
) => {
  switch (role) {
    case USER_ROLE.PC:
      if (
        statusOrder === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_REQUEST
      )
        return true;
      return false;
    case USER_ROLE.FW:
    case USER_ROLE.ADMIN:
      if (
        statusOrder === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_CHANGE_REQUEST ||
        statusOrder === ORDER_STATUS_DIV.CANCELLATION_REQUEST ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_REQUEST
      )
        return true;
      return false;
    case USER_ROLE.SUPPLIER:
      if (
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED ||
        statusOrder === ORDER_STATUS_DIV.CANCELLATION_APPROVED ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_DELIVERY_DATE_UNCONFIRMED
      )
        return true;
      return false;
  }
};

export const checkActiveDelOrdDetail = (
  statusOrder: ORDER_STATUS_DIV,
  role: USER_ROLE,
) => {
  switch (role) {
    case USER_ROLE.PC:
      if (
        statusOrder === ORDER_STATUS_DIV.ORDER_NOT_CONFIRM ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_UNDETERMINED ||
        statusOrder === ORDER_STATUS_DIV.DELIVERY_DATE_CONFIRMED ||
        statusOrder === ORDER_STATUS_DIV.CHANGE_REQUEST
      )
        return true;
      return false;
  }
};

export const checkActiveBtnOrdDraft = (isDraft: boolean, role: USER_ROLE) => {
  switch (role) {
    case USER_ROLE.PC:
      return true;
    case USER_ROLE.FW:
    case USER_ROLE.ADMIN:
    case USER_ROLE.SUPPLIER:
      if (isDraft) return false;
      return true;
  }
};

export const checkActiveCreateDraftBtn = (
  isDraft: boolean | undefined,
  isEmptyOrder: boolean,
  orderId: string | undefined,
) => {
  if (isEmptyOrder) {
    //Order's empty
    return true;
  } else {
    // Order is not empty => order_edition or order_duplication
    if (!!orderId) {
      // order_duplication
      return true;
    } else {
      //order_edition
      if (isDraft) {
        // order is a draft
        return true;
      } else {
        return false;
      }
    }
  }
};
