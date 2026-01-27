import { Heart, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import type { Thread } from "../ThreadCardItem";
import { toggleLike } from "@/store/likeSlice";

type Props = {
  thread: Thread;
  replyCount: number;
};

export const ThreadBody = ({ thread, replyCount }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const likeState = useSelector((state: RootState) => state.threadLike.likes);

  const likeData = likeState[thread.id];
  const isLiked = likeData?.liked ?? thread.liked ?? false;
  const likeCount = likeData?.count ?? thread.likes;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex gap-3">
        <img
          src={
            thread.creator.photo_profile
              ? `http://localhost:4000${thread.creator.photo_profile}`
              : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
          }
          className="h-12 w-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{thread.creator.full_name}</p>
          <p className="text-gray-400">@{thread.creator.username}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-lg">{thread.content}</p>

      {thread.image && (
        <img
          src={`http://localhost:4000${thread.image}`}
          className="rounded-lg max-h-96 object-contain"
        />
      )}

      {/* Actions */}
      <div className="flex gap-4 text-gray-400">
        <button
          onClick={() => dispatch(toggleLike(thread.id))}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <Heart
            size={18}
            fill={isLiked ? "red" : "none"}
            color={isLiked ? "red" : "currentColor"}
          />
          <span>{likeCount}</span>
        </button>

        <div className="flex items-center gap-1">
          <MessageCircle size={18} />
          <span>{replyCount} Replies</span>
        </div>
      </div>
    </div>
  );
};
