import { combineReducers } from "@reduxjs/toolkit";
import adminReducer from './adminReducers'
const rootReducer = combineReducers({
    admin: adminReducer,

    
})

export default rootReducer