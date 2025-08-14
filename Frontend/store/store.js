import { configureStore } from '@reduxjs/toolkit'
import createtaskReducer from './create/createReducer'
import gettaskReducer from './get/getTaskReducer'
const store = configureStore({
   reducer:{
    createtask:createtaskReducer,
    gettask:gettaskReducer
   }
})

export default store