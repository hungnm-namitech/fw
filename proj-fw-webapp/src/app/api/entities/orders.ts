import { axiosInstance } from '@/app/service/axios-instance';
import { ListOrder, ListOrderDetail, Order } from '@/app/types/entities';
import { getUpdateOrderStatusDiv } from '@/app/utils/orders';
import moment from 'moment';

const BASE_ENTITY_URL = '/orders';

export const save = async (
  data: {
    itemDetails: { itemDetailId: string; quantity: number }[];
    requestedDeadline: string | null;
    customerId: number;
    mixedLoadingFlag: boolean;
    vehicleClassDiv: string;
    destinationId: number;
    memo: string;
    temporalyFlag: boolean;
    tradingCompany: string | null;
    supplierCd: string | null | undefined;
    itemCd: string | null | undefined;
  },
  session: string,
) => {
  return axiosInstance.post(
    BASE_ENTITY_URL,
    {
      ...data,
      destinationId: data.destinationId || undefined,
      customerId: data.customerId || undefined,
      vehicleClassDiv: data.vehicleClassDiv || undefined,
      tradingCompany: data.tradingCompany || undefined,
    },
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  );
};

export const update = async (
  orderId: string,
  data: {
    itemDetails: { itemDetailId: string; quantity: number }[];
    requestedDeadline: string | null;
    customerId: number;
    mixedLoadingFlag: boolean;
    vehicleClassDiv: string;
    destinationId: number;
    memo: string;
    temporalyFlag: boolean;
    statusDiv: string;
  },
  session: string,
  isDraft: boolean | undefined,
) => {
  return (
    isDraft !== undefined &&
    axiosInstance.patch(
      BASE_ENTITY_URL + `/${orderId}/company-request`,
      {
        ...data,
        destinationId: data.destinationId || undefined,
        customerId: data.customerId || undefined,
        vehicleClassDiv: data.vehicleClassDiv || undefined,
        statusDiv: getUpdateOrderStatusDiv(
          +data.statusDiv,
          data.temporalyFlag,
          isDraft,
        ).toString(),
      },
      {
        headers: { Authorization: 'Bearer ' + session },
      },
    )
  );
};

export function getList(session: string, params: any): Promise<ListOrder> {
  const filteredObject = Object.keys(params).reduce((acc: any, key) => {
    if (params[key]) {
      if (key.includes('From') || key.includes('To')) {
        acc[key] = moment(params[key]).format();
      } else {
        acc[key] = params[key];
      }
    }
    return acc;
  }, {});
  const searchParams = new URLSearchParams(filteredObject);
  searchParams.set('perPage', '30');
  return axiosInstance.get(`${BASE_ENTITY_URL}?${searchParams.toString()}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}

export const getOrderDetail = (
  session: string,
  orderId: string,
): Promise<ListOrderDetail> => {
  return axiosInstance.get(BASE_ENTITY_URL + `/${orderId}`, {
    headers: {
      Authorization: `Bearer ${session}`,
    },
  });
};
export function find(id: string, session: string): Promise<Order> {
  return axiosInstance.get(BASE_ENTITY_URL + `/${id}`, {
    headers: { Authorization: 'Bearer ' + session },
  });
}
export function changeDeliveryRequest(
  id: string,
  data: any,
  session: string,
): Promise<any> {
  return axiosInstance.patch(
    BASE_ENTITY_URL + `/${id}/change-delivery-request`,
    data,
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  );
}

export const aprrovalOrderByFW = (
  memo: string,
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/admin-validation-request`,
    {
      action: 'Accept',
      memo,
    },
    { headers: { Authorization: `Bearer ${session}` } },
  );
};

export const refusalOrderByFW = (
  memo: string,
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/admin-validation-request`,
    {
      action: 'Refuse',
      memo,
    },
    { headers: { Authorization: `Bearer ${session}` } },
  );
};

export const cancelOrderByPC = (
  data: { statusDiv: string; memo: string; temporaryFlag: boolean | undefined },
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/company-request`,
    data,
    { headers: { Authorization: `Bearer ${session}` } },
  );
};
export function supplierValidationRequest(
  id: string,
  data: {
    action: 'Accept';
    deadlineDate: Date;
    memo: string;
  },
  session: string,
): Promise<any> {
  const requestData = {
    action: data.action,
    deadlineDate: data.deadlineDate.toISOString(),
    memo: data.memo,
  };

  return axiosInstance.patch(
    BASE_ENTITY_URL + `/${id}/supplier-validation-request`,
    requestData,
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  );
}

export const supplierValidateByStatus = (
  id: string,
  data: { changeDeadline: Date; memo: string },
  session: string,
): Promise<any> => {
  const requestData = {
    changeDealine: data.changeDeadline.toISOString(),
    memo: data.memo,
  };

  return axiosInstance.patch(
    BASE_ENTITY_URL + `/${id}/change-delivery-request`,
    requestData,
    {
      headers: { Authorization: 'Bearer ' + session },
    },
  );
};

export const aprrovalOrderBySub = (
  memo: string,
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/supplier-validation-request

    `,
    {
      action: 'Accept',
      memo,
    },
    { headers: { Authorization: `Bearer ${session}` } },
  );
};

export const refusalOrderBySub = (
  memo: string,
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/supplier-validation-request`,
    {
      action: 'Refuse',
      memo,
    },
    { headers: { Authorization: `Bearer ${session}` } },
  );
};

export const doDeliveryState = (
  orderId: number,
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/${orderId}/company-request`,
    {
      statusDiv: '10',
      temporaryFlag: false,
    },
    { headers: { Authorization: `Bearer ${session}` } },
  );
};

export const batchUpdateReplyDeadline = (
  memo: string,
  orderIds: any[],
  session: string,
): Promise<any> => {
  return axiosInstance.patch(
    `${BASE_ENTITY_URL}/batch-update-reply-deadline`,
    {
      memo: memo,
      orderIds: orderIds,
    },
    {
      headers: { Authorization: `Bearer ${session}` },
    },
  );
};
