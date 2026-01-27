import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setInitialLikes,
  toggleLike,
  updateLikeRealtime,
} from "../store/likeSlice";
import type { RootState, AppDispatch } from "../store/store";
import { api } from "@/services/api";
import { ThreadItem } from "./ThreadItem";
import { DetailThread } from "./Threads/DetailThread";

export type Creator = {
  id: number;
  username: string;
  full_name: string;
  photo_profile: string | null;
};

export type Thread = {
  id: number;
  content: string;
  image: string | null; // ⬅ WAJIB, bukan optional
  created_at: string;
  creator: {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
  };
  likes: number;
  replies: number;
  liked: boolean;
};

export const ThreadCardItem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const likeState = useSelector((state: RootState) => state.threadLike.likes);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedPost, setSelectedPost] = useState<Thread | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      const response = await api.get("/threads", { withCredentials: true });
      const dataThread = response.data.data || [];
      setThreads(dataThread);

      dispatch(
        setInitialLikes(
          dataThread.map((t: Thread) => ({
            threadId: t.id,
            likeCount: t.likes ?? 0,
            liked: t.liked ?? false,
          })),
        ),
      );
    };

    fetchThreads();

    socket.on("like_update", (data) => {
      dispatch(updateLikeRealtime(data));
    });

    socket.on("new-thread", (thread) => {
      setThreads((prev) => [thread, ...prev]);
    });

    return () => {
      socket.off("like_update");
      socket.off("new-thread");
    };
  }, [dispatch]);

  const handleLike = (id: number) => dispatch(toggleLike(id));
  const handleSelect = (id: number) =>
    setSelectedPost(threads.find((t) => t.id === id) || null);

  if (selectedPost) {
    return (
      <DetailThread post={selectedPost} onClose={() => setSelectedPost(null)} />
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      {threads.map((thread) => {
        const like = likeState[thread.id];
        return (
          <ThreadItem
            key={thread.id}
            thread={thread}
            isLiked={like?.liked ?? false}
            likeCount={like?.count ?? 0}
            handleLike={handleLike}
            handleSelect={handleSelect}
          />
        );
      })}
    </div>
  );
};
