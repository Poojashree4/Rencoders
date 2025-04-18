import { configureStore } from "@reduxjs/toolkit";
import ipReducer from './ipSlice';

export const store=configureStore({
    reducer:{
        ip:ipReducer,
    },
});