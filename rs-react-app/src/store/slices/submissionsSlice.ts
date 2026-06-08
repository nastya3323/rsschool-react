import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormData, Submission } from '../../types';

interface SubmissionsState {
  items: Submission[];
}

const initialState: SubmissionsState = {
  items: [],
};

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<FormData>) => {
      state.items.push({
        ...action.payload,
        id: Date.now().toString(),
        submittedAt: Date.now(),
        highlighted: true,
      });
    },
    clearHighlight: (state, action: PayloadAction<string>) => {
      const item = state.items.find((submission) => {
        return submission.id === action.payload;
      });

      if (item) {
        item.highlighted = false;
      }
    },
  },
});

export const { addSubmission, clearHighlight } = submissionsSlice.actions;
export default submissionsSlice.reducer;
