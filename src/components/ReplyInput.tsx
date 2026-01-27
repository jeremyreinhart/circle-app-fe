import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { api } from "@/services/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const ReplyInput = ({ threadId }: { threadId: number }) => {
  const user = useSelector((state: RootState) => state.user);
  const [replyText, setReplyText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePostReply = async () => {
    if ((!replyText.trim() && !imageFile) || loading) return;

    const formData = new FormData();
    if (replyText.trim()) formData.append("content", replyText);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);

      await api.post(`/reply?thread_id=${threadId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReplyText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6  border-gray-700 pt-3">
      {imagePreview && (
        <img src={imagePreview} className="max-h-64 rounded object-contain" />
      )}

      <div className="flex gap-3 items-center">
        <img
          src={
            user.photo_profile
              ? `http://localhost:4000${user.photo_profile}`
              : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
          }
          className="h-9 w-9 rounded-full"
        />

        <input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 bg-black border border-gray-700 rounded px-3 py-2"
        />

        <label className="cursor-pointer">
          <ImageIcon size={18} />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handlePostReply}
          disabled={loading}
          className="bg-blue-600 px-3 py-1 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Post"}
        </button>
      </div>
    </div>
  );
};
