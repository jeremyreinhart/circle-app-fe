import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import threadLikeReducer from "./likeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    threadLike: threadLikeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
