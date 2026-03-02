import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LeftBar } from "@/components/LeftBar";
import { useUsers } from "@/hooks/userSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useLogout } from "@/hooks/userLogout";
import type { UserState } from "@/store/userSlice";
import { useSelector } from "react-redux";
import { CardProfile } from "@/components/Profile/CardProfile";
import { SuggestedFollow } from "@/components/SugesstedFollow";

export const Search = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debounceSearch = useDebounce(search, 500);
  const logout = useLogout();

  const { users, loading, followUser, unfollowUser } = useUsers();
  const currentUser = useSelector((state: { user: UserState }) => state.user);

  const filteredUsers =
    debounceSearch.trim() === ""
      ? []
      : users.filter(
          (u) =>
            u.id !== currentUser.id &&
            (u.username?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
              u.full_name
                ?.toLowerCase()
                .includes(debounceSearch.toLowerCase())),
        );

  const showNotFound =
    !loading && debounceSearch.trim() !== "" && filteredUsers.length === 0;

  return (
    <div className="bg-black min-h-screen relative">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-white" />
        </button>
        <h1 className="text-green-500 font-bold text-xl">Search</h1>
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row pt-5 px-4">
        <div className="hidden lg:block lg:w-1/5 border-r border-neutral-800">
          <LeftBar userLogout={logout} />
        </div>

        <div className="w-full lg:w-3/5 border-r border-neutral-800 order-1 lg:order-none p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your friend"
            className="w-full px-4 py-2 rounded-2xl bg-gray-600 text-white mb-6"
          />

          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : showNotFound ? (
            <div className="text-center text-gray-400 mt-6">
              <p className="text-lg font-semibold text-white">
                No result for "{debounceSearch}"
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching something else
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 rounded-lg"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        user.photo_profile
                          ? `http://localhost:4000${user.photo_profile}`
                          : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg"
                      }
                      className="w-11 h-11 rounded-full"
                    />
                    <div>
                      <p className="text-white font-semibold">
                        {user.full_name}
                      </p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      user.is_following
                        ? unfollowUser(user.id)
                        : followUser(user.id)
                    }
                    className={`px-4 py-1.5 rounded-full text-sm ${
                      user.is_following
                        ? "bg-gray-700 text-white"
                        : "bg-white text-black"
                    }`}
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
