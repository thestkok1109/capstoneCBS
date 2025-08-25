import { configureStore } from "@reduxjs/toolkit";
import movieSeats from "./slice/movieSeats.slice";
import userReducer from "./slice/user.slice";

export const store = configureStore({
  reducer: {
    hoTen: () => {
      return "Nhan";
    },
    movieSeats,
    userReducer,
  },
});
