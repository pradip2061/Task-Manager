import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createtaskThunk = createAsyncThunk('createtask/createtaskThunk',async(formData,{dispatch,rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/createtask`,{formData},{
            withCredentials:true
        })
        if(response.status === 200){
            return response.data.message
        }
    } catch (error) {
        return rejectWithValue(error.response.data.message)
    }
})