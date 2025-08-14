import { createSlice } from "@reduxjs/toolkit";
import { createtaskThunk } from "./createThunk";

const createtask = createSlice({
name:'createtask',
initialState:{
    status:null,
    message:null,
},
reducers:{
    resetdata:(state)=>{
        state.status=null,
        state.message=null
    }
},
extraReducers:(builder)=>{
    builder.addCase(createtaskThunk.pending,(state)=>{
        state.status = 'pending',
        state.message = null
    }).addCase(createtaskThunk.fulfilled,(state,action)=>{
        state.status = 'success',
        state.message = action.payload
    }).addCase(createtaskThunk.rejected,(state,action)=>{
        state.status = 'failed',
        state.message = action.payload
    })
}
})

export const{resetdata}= createtask.actions
export default createtask.reducer