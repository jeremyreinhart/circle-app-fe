import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useTimeAgo } from "../hooks/timehooks";

export type Thread = {
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
  likes: number;
  replies: number;
  liked?: boolean;
};

interface Props {
  thread: Thread;
  isLiked: boolean;
  likeCount: number;
  handleLike: (id: number) => void;
  handleSelect: (id: number) => void;
}

const TimeAgoDisplay: React.FC<{ date: string }> = ({ date }) => {
  const relativeTime = useTimeAgo(date);
  return <span className="text-gray-400 text-sm">{relativeTime}</span>;
};

export const ThreadItem: React.FC<Props> = ({
  thread,
  isLiked,
  likeCount,
  handleLike,
  handleSelect,
}) => {
  return (
    <div className="flex gap-3 bg-black border-b p-5 hover:bg-neutral-900 transition rounded-lg">
      <img
        className="h-12 w-12 rounded-full"
        src={
          thread.creator.photo_profile
            ? `http://localhost:4000${thread.creator.photo_profile}`
            : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
        }
        alt={thread.creator.full_name}
      />

      <div className="flex-1">
        <div className="flex gap-2 items-center mb-1">
          <h1 className="text-white font-semibold">
            {thread.creator.full_name}
          </h1>
          <span className="text-gray-400 text-sm">
            @{thread.creator.username}
          </span>
          <TimeAgoDisplay date={thread.created_at} />
        </div>

        <p className="text-white mb-3">{thread.content}</p>

        {thread.image && (
          <img
            src={`http://localhost:4000${thread.image}`}
            alt="thread"
            className="mt-2 w-full max-h-[440px] object-cover rounded-lg"
          />
        )}

        <div className="flex gap-6 mt-3">
          <button
            onClick={() => handleLike(thread.id)}
            className="flex items-center gap-1 text-gray-400 cursor-pointer hover:text-red-500 transition"
          >
            <Heart
              size={20}
              fill={isLiked ? "red" : "none"}
              color={isLiked ? "red" : "white"}
            />
            <span className="text-white">{likeCount}</span>
          </button>

          <button
            onClick={() => handleSelect(thread.id)}
            className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition"
          >
            <MessageCircle size={20} />
            <span>{thread.replies} Replies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
