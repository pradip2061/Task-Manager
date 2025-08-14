import { createSlice } from "@reduxjs/toolkit";
import { gettaskThunk } from "./getTaskThunk";


const gettask = createSlice({
name:'gettask',
initialState:{
    status:null,
    message:null,
    todaytask:[],
      weeklyTasks:[]
},
reducers:{
    resetdataget:(state)=>{
        state.status=null,
        state.message=null
    }
},
extraReducers:(builder)=>{
    builder.addCase(gettaskThunk.pending,(state)=>{
        state.status = 'pending',
        state.message = null
    }).addCase(gettaskThunk.fulfilled,(state,action)=>{
        console.log(action.payload,"payload")
        state.status = 'success',
        state.todaytask = action.payload.todaytask
        state.weeklyTasks=action.payload.weeklyTasks
    }).addCase(gettaskThunk.rejected,(state,action)=>{
        state.status = 'failed',
        state.message = action.payload
    })
}
})

export const{resetdataget}= gettask.actions
export default gettask.reducer