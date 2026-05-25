import selectedReducer, { toggleSelect, clearAll } from '../store/selectedSlice';

describe('selectedSlice', () => {
  it('should return initial state', () => {
    expect(selectedReducer(undefined, { type: '@@INIT' })).toEqual({ ids: [] });
  });

  it('should toggleSelect add id', () => {
    const state = selectedReducer({ ids: [] }, toggleSelect(1));
    expect(state.ids).toEqual([1]);
  });

  it('should toggleSelect remove id', () => {
    const state = selectedReducer({ ids: [1, 2] }, toggleSelect(1));
    expect(state.ids).toEqual([2]);
  });

  it('should clearAll', () => {
    const state = selectedReducer({ ids: [1, 2] }, clearAll());
    expect(state.ids).toEqual([]);
  });
});
