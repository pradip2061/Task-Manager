import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const gettaskThunk = createAsyncThunk('gettask/gettaskThunk',async(_,{dispatch,rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/gettask`,{
            withCredentials:true
        })
        if(response.status === 200){
            return response.data
        }
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})