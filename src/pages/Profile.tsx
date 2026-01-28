import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type UserState } from "../store/userSlice";
import { CardProfile } from "@/components/Profile/CardProfile";
import { LeftBar } from "@/components/LeftBar";
import { useLogout } from "@/hooks/userLogout";
import { api } from "@/services/api";
import { ThreadItem } from "@/components/ThreadItem";
import {
  setInitialLikes,
  toggleLike,
  updateLikeRealtime,
  type LikeRealtimePayload,
} from "../store/likeSlice";
import type { AppDispatch, RootState } from "../store/store";
import { type Thread } from "@/components/ThreadCardItem";
import { socket } from "../socket";
import { ThreadReplies } from "@/components/Threads/ThreadReplies";
import { SuggestedFollow } from "@/components/SugesstedFollow";

type ThreadApiResponse = {
  id: number;
  content: string;
  image: string | null;
  created_at: string;
  creator: {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
  };
  _count: {
    likes: number;
    replies: number;
  };
};

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logout = useLogout();

  const user = useSelector((state: { user: UserState }) => state.user);
  const likeState = useSelector((state: RootState) => state.threadLike.likes);

  const [threadsUser, setThreadsUser] = useState<Thread[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "media">("all");
  const [openRepliesThreadId, setOpenRepliesThreadId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const fetchThreads = async () => {
      if (user.id) {
        try {
          const response = await api.get(`/threads/me/${user.id}`, {
            withCredentials: true,
          });
          const threadsData: ThreadApiResponse[] = response.data.data || [];
          const mappedThreads: Thread[] = threadsData.map((t) => ({
            id: t.id,
            content: t.content,
            image: t.image,
            created_at: t.created_at,
            creator: t.creator,
            likes: t._count.likes,
            replies: t._count.replies,
            liked: false,
          }));
          setThreadsUser(mappedThreads);
          dispatch(
            setInitialLikes(
              mappedThreads.map((t) => ({
                threadId: t.id,
                likeCount: t.likes ?? 0,
                liked: t.liked ?? false,
              })),
            ),
          );
        } catch (error) {
          console.error("Error fetching user threads:", error);
        }
      }
    };
    fetchThreads();
  }, [user.id, dispatch]);

  useEffect(() => {
    const handleLikeUpdate = (data: LikeRealtimePayload) => {
      dispatch(updateLikeRealtime(data));
    };
    socket.on("like_update", handleLikeUpdate);
    return () => {
      socket.off("like_update");
    };
  }, [dispatch]);

  useEffect(() => {
    const handleReplyNew = ({ thread_id }: { thread_id: number }) => {
      setThreadsUser((prev) =>
        prev.map((t) =>
          t.id === thread_id ? { ...t, replies: (t.replies ?? 0) + 1 } : t,
        ),
      );
    };

    socket.on("reply:new", handleReplyNew);

    return () => {
      socket.off("reply:new", handleReplyNew);
    };
  }, []);

  const handleSelect = (threadId: number) => {
    setOpenRepliesThreadId((prev) => (prev === threadId ? null : threadId));
  };

  const handleLike = (threadId: number) => {
    dispatch(toggleLike(threadId));
  };

  const mediaThreads = threadsUser.filter((thread) => thread.image);

  return (
    <div className="bg-black min-h-screen flex gap-3 pt-5 px-4">
      <LeftBar userLogout={logout} />

      <div className="flex-1 border-x border-neutral-800 max-w-4xl ml-64">
        <CardProfile className="" />

        <div className="flex border-b border-neutral-800 mt-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 font-semibold ${activeTab === "all" ? "text-white border-b-2 border-green-500" : "text-gray-500"}`}
          >
            All Post
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 font-semibold ${activeTab === "media" ? "text-white border-b-2 border-green-500" : "text-gray-500"}`}
          >
            Media
          </button>
        </div>

        <div className="p-4 text-white">
          {activeTab === "all" ? (
            <div className="flex flex-col gap-4">
              {threadsUser.length > 0 ? (
                threadsUser.map((thread) => {
                  const likeData = likeState[thread.id];
                  const isLiked = likeData?.liked ?? false;
                  const likeCount = likeData?.count ?? 0;

                  const syncThread = {
                    ...thread,
                    creator: {
                      ...thread.creator,
                      full_name: user.full_name || thread.creator.full_name,
                      username: user.username || thread.creator.username,
                      photo_profile:
                        user.photo_profile || thread.creator.photo_profile,
                    },
                  };

                  return (
                    <React.Fragment key={thread.id}>
                      <ThreadItem
                        thread={syncThread}
                        isLiked={isLiked}
                        likeCount={likeCount}
                        handleLike={handleLike}
                        handleSelect={handleSelect}
                      />
                      {openRepliesThreadId === thread.id && (
                        <ThreadReplies threadId={thread.id} />
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">No posts found</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {mediaThreads.length > 0 ? (
                mediaThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="aspect-square rounded-md overflow-hidden bg-neutral-900"
                  >
                    <img
                      src={`http://localhost:4000${thread.image}`}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-3">
                  No media found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-10 w-60 mr-50 ">
        <CardProfile
          className="w-100 bg-neutral-900 rounded p-4"
          my={"My Profile"}
        />
        <SuggestedFollow />
      </div>
    </div>
  );
};
