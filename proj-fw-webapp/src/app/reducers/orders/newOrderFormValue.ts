import { PulldownNewEntry, TabularNewEntry } from '@/app/types/orders';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: TabularNewEntry | PulldownNewEntry | null = null as
  | TabularNewEntry
  | PulldownNewEntry
  | null;
export const newEntryFormData = createSlice({
  name: 'create-order-form-value',
  initialState,
  reducers: {
    setNewEntryFormData: (
      state,
      action: PayloadAction<TabularNewEntry | PulldownNewEntry>,
    ) => {
      return action.payload;
    },
    emptyNewEntryFormData: () => null,
  },
});

// Action creators are generated for each case reducer function
export const { setNewEntryFormData, emptyNewEntryFormData } =
  newEntryFormData.actions;

export default newEntryFormData.reducer;
