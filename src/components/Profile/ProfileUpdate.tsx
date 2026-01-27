import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, type UserState } from "../../store/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { api } from "@/services/api";

interface ProfileUpdateProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileUpdate = ({ isOpen, onClose }: ProfileUpdateProps) => {
  const dispatch = useDispatch();

  const user = useSelector((state: { user: UserState }) => state.user);

  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    username: user.username || "",
    bio: user.bio || "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("username", formData.username);
    data.append("bio", formData.bio);
    if (file) data.append("profile", file);

    try {
      // 2. Update data profile to Server
      const response = await api.patch("/user/profile", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3. Update data profile on Redux
      dispatch(updateProfile(response.data.data));
      onClose();
    } catch (error) {
      console.error("Gagal update profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Edit profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative h-24 bg-gradient-to-r from-green-200 via-yellow-200 to-yellow-400 rounded-t-lg">
            <div className="absolute -bottom-8 left-4">
              <div className="relative group">
                <img
                  src={
                    previewImage ||
                    `http://localhost:4000${user.photo_profile}` ||
                    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                  }
                  className="w-20 h-20 rounded-full border-4 border-neutral-900 object-cover"
                  alt="Profile"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="text-white" size={20} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid gap-4 mt-8">
            <div className="grid gap-2">
              <label htmlFor="full_name" className="text-neutral-400">
                Name
              </label>
              <input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border border-neutral-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white outline-none"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="username" className="text-neutral-400">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent border border-neutral-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white outline-none"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-neutral-400">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-transparent border border-neutral-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-white resize-none outline-none"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-2 font-bold"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
