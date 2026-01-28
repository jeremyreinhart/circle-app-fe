import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 payload dari HTTP (toggle like)
export interface LikeHttpPayload {
  threadId: number;
  likeCount: number;
  liked: boolean;
}

// 🔥 payload dari socket (realtime)
export interface LikeRealtimePayload {
  threadId: number;
  likeCount: number;
  liked?: boolean;
}

interface LikeState {
  likes: Record<
    number,
    {
      count: number;
      liked: boolean;
    }
  >;
}

const initialState: LikeState = {
  likes: {},
};

export const toggleLike = createAsyncThunk<LikeHttpPayload, number>(
  "threadLike/toggleLike",
  async (threadId) => {
    const res = await axios.post(
      `http://localhost:4000/api/v1/threads/${threadId}/like`,
      {},
      { withCredentials: true },
    );

    return {
      threadId,
      likeCount: res.data.likeCount,
      liked: res.data.liked,
    };
  },
);

const threadLikeSlice = createSlice({
  name: "threadLike",
  initialState,
  reducers: {
    updateLikeRealtime: (state, action: PayloadAction<LikeRealtimePayload>) => {
      const { threadId, likeCount, liked } = action.payload;
      const prev = state.likes[threadId];

      state.likes[threadId] = {
        count: likeCount,
        liked: liked ?? prev?.liked ?? false,
      };
    },
    setInitialLikes: (state, action: PayloadAction<LikeHttpPayload[]>) => {
      action.payload.forEach((item) => {
        state.likes[item.threadId] = {
          count: item.likeCount,
          liked: item.liked,
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      const { threadId, likeCount, liked } = action.payload;

      state.likes[threadId] = {
        count: likeCount,
        liked,
      };
    });
  },
});

export const { updateLikeRealtime, setInitialLikes } = threadLikeSlice.actions;
export default threadLikeSlice.reducer;
