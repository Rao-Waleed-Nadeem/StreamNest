import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  accessToken: "",
};

// Create the slice
export const tokenSlice = createSlice({
  name: "accessToken",
  initialState,
  reducers: {
    // Define the setUser reducer directly here
    setAccessToken: (state, action) => {
      // console.log("Updating state with:", action.payload);
      state.accessToken = action.payload; // Updates the user in the state
    },
  },
});

// Export synchronous actions
export const { setAccessToken } = tokenSlice.actions;

// Export the reducer
export default tokenSlice.reducer;
