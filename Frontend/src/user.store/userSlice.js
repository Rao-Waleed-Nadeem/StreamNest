import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  history: [],
};

// Create the slice
export const userSlice = createSlice({
  name: "user",
  name: "userDetails",
  name: history,
  initialState,
  reducers: {
    // Define the setUser reducer directly here
    setUser: (state, action) => {
      // console.log("Updating state with:", action.payload);
      state.user = action.payload; // Updates the user in the state
    },
    setUserDetails: (state, action) => {
      // console.log("Updating state with:", action.payload);
      state.userDetails = action.payload; // Updates the user in the state
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

// Export synchronous actions
export const { setUser, setUserDetails, setHistory } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
