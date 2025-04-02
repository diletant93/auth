import { RootState } from "../store/store";

export const selectMode = (state:RootState) => state.modeSliceReducer.mode
export const selectError = (state:RootState) => state.modeSliceReducer.error