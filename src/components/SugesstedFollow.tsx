import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { socket } from "@/socket";

type SuggestedUser = {
  id: number;
  username: string;
  full_name: string;
  photo_profile: string | null;
  bio: string;
};

type Props = {
  className?: string;
};

export const SuggestedFollow = ({
  className = "bg-neutral-900 flex flex-col w-100 p-5 gap-5",
}: Props) => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestedUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/follows/suggested", {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setSuggestedUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();

    const handleFollowAction = (data: {
      followerId: number;
      followingId: number;
      action: "follow" | "unfollow";
    }) => {
      if (data.action === "follow") {
        // Hapus user dari suggested list saat di-follow
        setSuggestedUsers((prev) =>
          prev.filter((user) => user.id !== data.followingId),
        );
      } else if (data.action === "unfollow") {
        fetchSuggestedUsers();
      }
    };

    socket.on("follow-action", handleFollowAction);

    return () => {
      socket.off("follow-action", handleFollowAction);
    };
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      // Optimistic update - hapus dari UI dulu untuk UX yang lebih baik
      setSuggestedUsers((prev) => prev.filter((user) => user.id !== userId));

      await api.post(
        "/follows",
        { user_id: userId },
        { withCredentials: true },
      );

      // Server akan emit socket event, semua komponen akan update
    } catch (error) {
      console.error("Error following user:", error);
      // Rollback jika error - refetch data
      fetchSuggestedUsers();
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  if (!loading && suggestedUsers.length === 0) {
    return (
      <div className="bg-neutral-900 flex flex-col gap-10 w-100 p-5 h-40 mt-10">
        <h1 className="text-white font-semibold text-2xl">Suggested for you</h1>
        <p className="text-white text-xl">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h1 className="text-white font-semibold text-2xl">Suggested for you</h1>
      {suggestedUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-4 mt-3">
          <img
            src={
              user.photo_profile
                ? `http://localhost:4000${user.photo_profile}`
                : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-white flex-1">
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-sm text-gray-400">@{user.username}</p>
            {user.bio && (
              <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
            )}
          </div>
          <button
            onClick={() => handleFollow(user.id)}
            className="text-white rounded-2xl border px-4 py-1 flex items-end text-sm font-semibold cursor-pointer hover:bg-neutral-600 transition-colors"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};
