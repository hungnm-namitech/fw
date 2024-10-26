import { RootState } from '@/app/store';

export const selectNewEntryFormData = (state: RootState) =>
  state.orders.newOrderFormValue;

export const selectOrderDetail = (state: RootState) => state.orders.order;
