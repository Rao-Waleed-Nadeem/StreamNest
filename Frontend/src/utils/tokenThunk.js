import axios from "axios";
import { setAccessToken } from "./tokenSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

const setAccessToken = (token) => async (dispatch) => {
  try {
    // console.log("All history: ", response.data.data);
    dispatch(setAccessToken(token));
  } catch (err) {
    console.log("Error: ", err);
  }
};

export { setAccessToken };
