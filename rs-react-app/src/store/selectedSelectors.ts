import type { RootState } from './store';

export const selectSelectedIds = (state: RootState) => state.selected.ids;
