import { createSlice } from '@reduxjs/toolkit';

const initialState= {
    loading: false,
  }
  
  const mailLoginSlice = createSlice({
    name: "mailLogin",
    initialState,
    reducers: {
      mailLoginLoading: (state, action) => {
        state.loading = true;
      },
      mailLoadingDone: (state, action) => {
        state.loading = false;
      },
     
    },
  });
  
  export const {
    mailLoginLoading,
    mailLoadingDone,
  
  } = mailLoginSlice.actions;
  
  export default mailLoginSlice.reducer;