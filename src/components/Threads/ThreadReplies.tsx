import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { socket } from "../../socket";
import { ReplyInput } from "../ReplyInput";

type Reply = {
  id: number;
  content: string;
  image?: string | null;
  created_at: string;
  creator: {
    id: number;
    full_name: string;
    username: string;
    photo_profile: string | null;
  };
};

export const ThreadReplies = ({ threadId }: { threadId: number }) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      const res = await api.get(`/reply?thread_id=${threadId}`, {
        withCredentials: true,
      });
      setReplies(res.data.data ?? []);
    };

    fetchReplies();
  }, [threadId]);

  useEffect(() => {
    socket.emit("join-thread", threadId);

    const handleNewReply = (reply: Reply & { thread_id: number }) => {
      if (reply.thread_id === threadId) {
        setReplies((prev) =>
          prev.some((r) => r.id === reply.id) ? prev : [...prev, reply],
        );
      }
    };

    socket.on("reply:new", handleNewReply);

    return () => {
      socket.emit("leave-thread", threadId);
      socket.off("reply:new", handleNewReply);
    };
  }, [threadId]);

  return (
    <div className="mt-4  flex flex-col gap-4  border-gray-700">
      <ReplyInput threadId={threadId} />
      {replies.length === 0 && (
        <p className="text-gray-400 text-sm">No replies yet</p>
      )}

      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-3 border-t pt-3">
          <img
            src={
              reply.creator.photo_profile
                ? `http://localhost:4000${reply.creator.photo_profile}`
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
            }
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">
              {reply.creator.full_name}
              <span className="text-gray-400 ml-1">
                @{reply.creator.username}
              </span>
            </p>
            <p className="text-sm">{reply.content}</p>
            {reply.image && (
              <img
                src={`http://localhost:4000${reply.image}`}
                className="mt-2 rounded max-h-48 object-contain"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
