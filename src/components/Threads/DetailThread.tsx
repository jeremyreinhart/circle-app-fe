import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { Thread } from "../ThreadCardItem";
import { ThreadBody } from "./ThreadBody";
import { ThreadReplies } from "./ThreadReplies";
import { api } from "@/services/api";
import { socket } from "@/socket";

type Reply = {
  id: number;
};

type Props = {
  post: Thread | null;
  onClose: () => void;
};

export const DetailThread = ({ post, onClose }: Props) => {
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    if (!post) return;

    const fetchReplies = async () => {
      const res = await api.get(`/reply?thread_id=${post.id}`, {
        withCredentials: true,
      });
      setReplies(res.data.data ?? []);
    };

    fetchReplies();
  }, [post]);

  useEffect(() => {
    if (!post) return;

    socket.emit("join-thread", post.id);

    const handleNewReply = (reply: Reply & { thread_id: number }) => {
      if (reply.thread_id !== post.id) return;
      setReplies((prev) =>
        prev.some((r) => r.id === reply.id) ? prev : [...prev, reply],
      );
    };

    socket.on("reply:new", handleNewReply);

    return () => {
      socket.emit("leave-thread", post.id);
      socket.off("reply:new", handleNewReply);
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="flex flex-col gap-4 p-4 bg-black text-white">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-gray-300"
      >
        <ArrowLeft />
        <span>Status</span>
      </button>

      <ThreadBody thread={post} replyCount={replies.length} />

      <ThreadReplies threadId={post.id} />
    </div>
  );
};
