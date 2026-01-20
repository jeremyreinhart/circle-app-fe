import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  full_name: string | null;
  email: string | null;
  username: string | null;
  photo_profile: string | null;
  bio: string | null;
}

const initialState: UserState = {
  id: null,
  full_name: null,
  email: null,
  username: null,
  photo_profile: null,
  bio: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => ({
      ...state,
      ...action.payload,
    }),
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
