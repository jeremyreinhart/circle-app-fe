import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ProfileUpdate } from "./ProfileUpdate";
import { api } from "@/services/api";
import { socket } from "@/socket";
import type { UserState } from "../../store/userSlice";

type Props = { className?: string; my?: string };

type FollowCounts = { followers: number; following: number };

export const CardProfile = ({
  className = "w-full bg-neutral-800",
  my,
}: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const user = useSelector((state: { user: UserState }) => state.user);
  const [followCounts, setFollowCounts] = useState<FollowCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id) return;
    const fetchFollowCounts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/follows/count/${user.id}`, {
          withCredentials: true,
        });
        if (res.data.status === "success") setFollowCounts(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowCounts();
  }, [user.id]);

  useEffect(() => {
    if (!user.id) return;

    socket.emit("join-user", user.id);

    socket.on("follow-action", async (data) => {
      if (data.followerId === user.id || data.followingId === user.id) {
        try {
          const res = await api.get(`/follows/count/${user.id}`, {
            withCredentials: true,
          });
          if (res.data.status === "success") setFollowCounts(res.data.data);
        } catch (error) {
          console.error(error);
        }
      }
    });

    return () => {
      socket.emit("leave-user", user.id);
      socket.off("follow-action");
    };
  }, [user.id]);

  if (!user.id) return <p className="text-white">User not found</p>;

  return (
    <div className={className}>
      <p className="text-white font-semibold text-2xl mb-3">{my}</p>
      <div className="relative h-30 bg-gradient-to-r from-green-200 via-yellow-200 to-yellow-400 rounded-xl mx-2">
        <img
          src={
            user.photo_profile
              ? `http://localhost:4000${user.photo_profile}`
              : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
          }
          alt="profile"
          className="w-24 h-24 rounded-full border-4 border-black absolute -bottom-12 left-6 object-cover"
        />
      </div>
      <div className="flex justify-end mt-4 mr-4">
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className="px-4 py-1 text-sm rounded-full border border-white text-white hover:bg-neutral-800 cursor-pointer"
        >
          Edit Profile
        </button>
      </div>
      <div className="mt-4 ml-6">
        <p className="text-white font-bold text-2xl">✨ {user.full_name} ✨</p>
        <p className="text-gray-500">@{user.username}</p>
        <p className="text-white mt-2">{user.bio}</p>
        <div className="flex gap-5 mt-2">
          <p className="text-white font-semibold">
            {loading ? "..." : (followCounts?.following ?? 0)}{" "}
            <span className="text-gray-500 font-normal">Following</span>
          </p>
          <p className="text-white font-semibold">
            {loading ? "..." : (followCounts?.followers ?? 0)}{" "}
            <span className="text-gray-500 font-normal">Followers</span>
          </p>
        </div>
      </div>
      <ProfileUpdate
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
};
