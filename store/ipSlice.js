import { createSlice } from "@reduxjs/toolkit";

const ipSlice= createSlice({
    name:'ip',
    initialState:{
        value:'http://192.168.1.18:4000',

    },
    reducers:{
        setIP:(state, action)=>{
            state.value=action.payload;
        },
    },
});

export const {setIP} = ipSlice.actions;
export default ipSlice.reducer;