import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { LeftBar } from "@/components/LeftBar";
import { CardProfile } from "@/components/Profile/CardProfile";
import { SuggestedFollow } from "@/components/SugesstedFollow";
import { useLogout } from "@/hooks/userLogout";
import { api } from "@/services/api";
import { socket } from "@/socket";

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
  const [isOpen, setIsOpen] = useState(false);

  const logout = useLogout();

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

  useEffect(() => {
    const handleFollowAction = () => {
      fetchFollows();
    };

    socket.on("follow-action", handleFollowAction);

    return () => {
      socket.off("follow-action", handleFollowAction);
    };
  }, [tab]);

  const handleFollow = async (user: FollowUser) => {
    try {
      if (!user.is_following) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_following: true } : u,
          ),
        );

        await api.post(
          "/follows",
          { user_id: user.id },
          { withCredentials: true },
        );
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_following: false } : u,
          ),
        );

        await api.delete("/follows", {
          data: { user_id: user.id },
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error("Follow error:", error);
      fetchFollows();
    }
  };

  return (
    <div className="bg-black min-h-screen relative">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-white" />
        </button>
        <h1 className="text-green-500 font-bold text-xl">Follows</h1>
        <div />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-dvh w-64 bg-black border-r border-neutral-800 z-50 transform transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <X className="text-white" />
          </button>
        </div>
        <LeftBar userLogout={logout} />
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pt-5 px-4">
        {/* LEFT DESKTOP */}
        <div className="hidden lg:block lg:w-1/5 border-r border-neutral-800">
          <LeftBar userLogout={logout} />
        </div>

        {/* CENTER CONTENT */}
        <div className="w-full lg:w-3/5 border-r border-neutral-800 order-1 lg:order-none p-4 text-white">
          <h1 className="text-2xl font-semibold mb-4">Follows</h1>

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
                  ? "border-b-2 border-green-500"
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
                <div
                  key={user.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-3 items-center">
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

                  <button
                    onClick={() => handleFollow(user)}
                    className={
                      user.is_following
                        ? "border border-gray-500 px-4 py-1 rounded-full text-sm hover:bg-neutral-800 transition-colors"
                        : "bg-white text-black px-4 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    }
                  >
                    {user.is_following ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/4 p-4 space-y-6 order-2 lg:order-none">
          <CardProfile />
          <SuggestedFollow />
        </div>
      </div>
    </div>
  );
};
