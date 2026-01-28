import { LeftBar } from "@/components/LeftBar";
import { CardProfile } from "@/components/Profile/CardProfile";
import { SuggestedFollow } from "@/components/SugesstedFollow";
import { useLogout } from "@/hooks/userLogout";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

type FollowUser = {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  is_following?: boolean;
  bio: string;
};

export const Follows = () => {
  const [tab, setTab] = useState<"followers" | "following">("followers");
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFollows = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/follows?type=${tab}`, {
        withCredentials: true,
      });

      const list: FollowUser[] =
        tab === "followers"
          ? response.data.data.followers
          : response.data.data.following.map((u: FollowUser) => ({
              ...u,
              is_following: true,
            }));

      setUsers(list || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollows();
  }, [tab]);

  const handleFollow = async (user: FollowUser) => {
    try {
      if (!user.is_following) {
        // FOLLOW
        await api.post(
          "/follows",
          { user_id: user.id },
          { withCredentials: true },
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_following: true } : u,
          ),
        );
      } else {
        // UNFOLLOW
        await api.delete("/follows", {
          data: { user_id: user.id },
          withCredentials: true,
        });
        // update UI: toggle tombol
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_following: false } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const logout = useLogout();

  return (
    <div className="bg-black min-h-screen flex justify-center pt-5 px-4">
      <LeftBar userLogout={logout} />
      <div className="w-504  mr-30 text-white border-r border-l ml-70">
        <h1 className="text-3xl font-semibold ml-5">Follows</h1>
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setTab("followers")}
            className={`flex-1 py-2 ${
              tab === "followers"
                ? "border-b-2 border-green-500"
                : "text-gray-400"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setTab("following")}
            className={`flex-1 py-2 ${
              tab === "following"
                ? "border-b-2 border-green-500 "
                : "text-gray-400"
            }`}
          >
            Following
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">No users found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div className="flex gap-3 items-center ml-2">
                  <img
                    src={
                      user.avatar
                        ? `http://localhost:4000${user.avatar}`
                        : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                    }
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    <p className="text-sm text-white">{user.bio}</p>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => handleFollow(user)}
                  className={
                    user.is_following
                      ? "border border-gray-500 px-4 py-1 rounded-full text-sm mr-2 hover:bg-neutral-800 transition-colors"
                      : "bg-white text-black px-4 py-1 rounded-full text-sm mr-2 hover:bg-gray-200 transition-colors"
                  }
                >
                  {user.is_following ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col ">
        <CardProfile className="w-100 bg-neutral-900 rounded p-5" />
        <SuggestedFollow className="mt-5 bg-neutral-900 rounded p-4" />
      </div>
    </div>
  );
};
