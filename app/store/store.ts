import { configureStore } from "@reduxjs/toolkit";
import modeSliceReducer from '@/app/modeSlice/slice'
const store = configureStore({
    reducer:{
        modeSliceReducer
    }
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
