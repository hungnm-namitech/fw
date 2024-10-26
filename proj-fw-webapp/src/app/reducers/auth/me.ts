import { me } from '@/app/api/entities/users';
import { Me } from '@/app/types/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getMeThunk = createAsyncThunk(
  'getMeThunk',
  async (
    { session }: { session: string },
    { rejectWithValue, fulfillWithValue },
  ) => {
    try {
      const data = await me(session);

      return fulfillWithValue(data);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const initialState = {
  loading: true,
  data: null,
} as {
  loading: boolean;
  data: null | Me;
  error?: { code?: string; message?: string };
};

const authMeSlice = createSlice({
  name: 'auth/me',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getMeThunk.pending, () => {
      return {
        data: null,
        loading: true,
      };
    });

    builder.addCase(getMeThunk.fulfilled, (_, payload) => {
      return {
        data: payload.payload as any,
        loading: false,
      };
    });

    builder.addCase(getMeThunk.rejected, (_, payload) => {
      return {
        data: null,
        loading: false,
        error: payload.error,
      };
    });
  },
});

export default authMeSlice.reducer;
