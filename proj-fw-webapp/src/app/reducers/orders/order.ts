import { Order } from '@/app/types/entities';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { find } from '@/app/api/entities/orders';

export const findOrderDetail = createAsyncThunk(
  'find-order-detail',
  async (
    { orderId, session }: { orderId: string; session: string },
    { rejectWithValue, fulfillWithValue },
  ) => {
    try {
      const response = await find(orderId, session);
      return fulfillWithValue(response);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const initialState: {
  loading: boolean;
  data: Order | null;
  error?: {
    code?: string;
    message?: string;
  };
} = {
  loading: true,
  data: null,
};
export const orderDetail = createSlice({
  name: 'order-detail',
  initialState,
  reducers: {
    emptyOrderDetailData: (): any => null,
  },
  extraReducers: builder => {
    builder.addCase(findOrderDetail.pending, () => {
      return {
        loading: true,
        data: null,
      };
    });
    builder.addCase(findOrderDetail.rejected, (state, payload) => {
      return {
        loading: false,
        data: null,
        error: payload.error,
      };
    });
    builder.addCase(findOrderDetail.fulfilled, (_, payload) => {
      return { loading: false, data: payload.payload };
    });
  },
});

// Action creators are generated for each case reducer function
export const { emptyOrderDetailData } = orderDetail.actions;

export default orderDetail.reducer;
