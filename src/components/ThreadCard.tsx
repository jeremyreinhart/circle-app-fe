import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./Button";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { ThreadCardItem } from "./ThreadCardItem";
import { api } from "@/services/api";

export const ThreadCard = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: RootState) => state.user);

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
    if (!content.trim() && !image) {
      alert("Isi content atau pilih image minimal satu!");
      return;
    }

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
      console.error("Gagal post thread:", error);
      alert("Gagal memposting thread");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-6 border-l border-r max-w-4xl mx-auto w-full ml-70">
      {/* Flash message */}
      {flashMessage && (
        <div className="ml-50 w-100 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-3 shadow-lg z-50 flex items-center gap-3 animate-slide-in">
          {flashMessage}
        </div>
      )}

      <h1 className="text-white font-bold text-2xl mb-4 ml-4">Home</h1>

      {/* Form post thread */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="flex gap-4 items-center bg-black p-3 rounded-2xl cursor-pointer  transition">
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
              className="flex-1 bg-transparent text-white font-semibold text-lg outline-none placeholder-gray-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <i className="bi bi-image text-2xl text-gray-400 hover:text-white transition"></i>
            </label>
            <Button
              typebut="submit"
              clasName="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
              text="Post"
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

      <ThreadCardItem />
    </section>
  );
};
