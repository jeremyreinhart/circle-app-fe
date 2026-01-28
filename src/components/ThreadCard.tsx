import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { api } from "@/services/api";
import { ThreadCardItem, type Thread } from "./ThreadCardItem";
import { socket } from "@/socket";

export const ThreadCard = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: RootState) => state.user);

  // Fetch initial threads
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/thread", { withCredentials: true });
        setThreads(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      }
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    const handleNewReplyCount = (data: {
      threadId: number;
      increment: number;
    }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === data.threadId
            ? { ...t, replies: t.replies + data.increment }
            : t,
        ),
      );
    };

    socket.on("reply:count", handleNewReplyCount);

    return () => {
      socket.off("reply:count", handleNewReplyCount);
    };
  }, []);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle post thread
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("User belum login");
    if (!content.trim() && !image)
      return alert("Isi content atau pilih image!");

    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    if (image) formData.append("image", image);
    formData.append("creatorId", user.id!.toString());

    try {
      setLoading(true);

      await api.post("/thread", formData, {
        withCredentials: true,
      });

      setContent("");
      setImage(null);
      setPreview(null);
      setIsOpen(false);
      setFlashMessage("Thread berhasil diposting!");
      setTimeout(() => setFlashMessage(null), 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal memposting thread");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-6 border-l border-r max-w-3xl mx-auto w-full ml-75">
      {flashMessage && (
        <div className="ml-50 w-100 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-slide-in">
          {flashMessage}
        </div>
      )}

      <h1 className="text-white font-bold text-2xl mb-4 ml-4">Home</h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="flex gap-4 items-center bg-black p-3 rounded-2xl cursor-pointer">
            <img
              src={
                user.photo_profile
                  ? `http://localhost:4000${user.photo_profile}`
                  : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
              }
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder="What's happening?"
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          </div>
        </DialogTrigger>

        <DialogContent className="bg-black p-6 rounded-xl w-full max-w-3xl max-h-[90vh]">
          <form onSubmit={handlePost} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <img
                src={
                  user.photo_profile
                    ? `http://localhost:4000${user.photo_profile}`
                    : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                }
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <input
                type="text"
                placeholder="What's happening?"
                className="flex-1 bg-black h-30 text-white p-3 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {preview && (
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-100 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <i className="bi bi-image text-2xl"></i> Upload
              </label>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ThreadCardItem threads={threads} setThreads={setThreads} />
    </section>
  );
};
