import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SelectedState {
  ids: number[];
}

const initialState: SelectedState = {
  ids: [],
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    toggleSelect: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((i) => {
          return i !== id;
        });
      } else {
        state.ids.push(id);
      }
    },

    clearAll: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleSelect, clearAll } = selectedSlice.actions;
export default selectedSlice.reducer;
