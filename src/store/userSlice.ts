import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
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
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    clearUser: () => initialState,
  },
});

export const { setUser, updateProfile, clearUser } = userSlice.actions;
export default userSlice.reducer;
