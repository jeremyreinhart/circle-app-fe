import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

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
          console.error(error);
        }
      }
    };
    fetchThreads();
  }, [user.id, dispatch]);

  useEffect(() => {
    socket.on("like_update", (data: LikeRealtimePayload) =>
      dispatch(updateLikeRealtime(data)),
    );
    return () => {
      socket.off("like_update");
    };
  }, [dispatch]);

  useEffect(() => {
    socket.on("reply:new", ({ thread_id }: { thread_id: number }) => {
      setThreadsUser((prev) =>
        prev.map((t) =>
          t.id === thread_id ? { ...t, replies: (t.replies ?? 0) + 1 } : t,
        ),
      );
    });
    return () => {
      socket.off("reply:new");
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
    <div className="bg-black min-h-screen relative">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-white" />
        </button>
        <h1 className="text-green-500 font-bold text-xl">Profile</h1>
        <div />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-dvh w-64 bg-black border-r border-neutral-800 z-50 transform transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X className="text-white" />
          </button>
        </div>
        <LeftBar userLogout={logout} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pt-5 px-4">
        <div className="hidden lg:block lg:w-1/5 border-r border-neutral-800">
          <LeftBar userLogout={logout} />
        </div>

        <div className="w-full lg:w-3/5 border-r border-neutral-800 order-1 lg:order-none">
          <CardProfile />

          <div className="flex border-b border-neutral-800 mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-3 font-semibold ${
                activeTab === "all"
                  ? "text-white border-b-2 border-green-500"
                  : "text-gray-500"
              }`}
            >
              All Post
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`flex-1 py-3 font-semibold ${
                activeTab === "media"
                  ? "text-white border-b-2 border-green-500"
                  : "text-gray-500"
              }`}
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

                    return (
                      <React.Fragment key={thread.id}>
                        <ThreadItem
                          thread={thread}
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

        <div className="w-full lg:w-1/4 p-4 space-y-6 order-2 lg:order-none">
          <CardProfile my="My Profile" />
          <SuggestedFollow />
        </div>
      </div>
    </div>
  );
};
