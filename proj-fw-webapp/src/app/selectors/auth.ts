import { RootState } from '../store';

export const selectMe = (state: RootState) => state.auth.me;
