import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
type InitialStateType = {
    mode:'dark'|'light';
    isLoading:boolean;
    error:string;
}
const INITIAL_STATE : InitialStateType = {
    mode:'dark',
    isLoading:false,
    error:''
}
const modeSlice = createSlice({
    name:'mode',
    initialState: INITIAL_STATE,
    reducers:{
        consoleMode(state){
            console.log(state.mode)
        },
        toggleMode(state,action: PayloadAction<'dark'|'light'>){
            state.mode = action.payload
        }
    },
    extraReducers:(builder)=>{
            builder.addCase(toggleModeAsync.pending,(state)=>{
                    state.isLoading = true
            })  
            .addCase(toggleModeAsync.fulfilled,(state, action:PayloadAction<'dark'|'light'>)=>{
                state.mode = action.payload
                state.error = ''
                state.isLoading = false
            })
            .addCase(toggleModeAsync.rejected, (state, action)=>{
                state.isLoading = false
                state.error = action.payload as string
            })
       }
})

export const consoleModeAsync = createAsyncThunk<void,void>(
    'modeSlice/consoleModeAsync',
    async () =>{
       return await new Promise((resolve)=> setTimeout(()=>{console.log('data'); resolve('data')},2000)).then(data => console.log(data))
    }
)
export const toggleModeAsync = createAsyncThunk<'dark'|'light',{mode:'dark'|'light'; status:'success'|'error';}, { rejectValue: string }>(
    'modeSlice/toggleModeAsync',
    async (request,thunkApi) => { 

        if(request.status === 'error') return thunkApi.rejectWithValue('Status is error')

        await new Promise((resolve) => setTimeout(resolve, 2000));
        return request.mode
    }
)


export const {consoleMode, toggleMode} = modeSlice.actions
export default modeSlice.reducer