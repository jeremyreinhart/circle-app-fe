import { LeftBar } from "@/components/LeftBar";
import { useUsers } from "@/hooks/userSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { useLogout } from "@/hooks/userLogout";
import type { UserState } from "@/store/userSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CardProfile } from "@/components/Profile/CardProfile";
import { SuggestedFollow } from "@/components/SugesstedFollow";

export const Search = () => {
  const [search, setSearch] = useState("");
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
    <div className="bg-black min-h-screen flex justify-center pt-5 px-4 ">
      <LeftBar userLogout={logout} />

      <div className="w-200 border-r border-l ml-50">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your friend"
          className="w-180 ml-10 mt-3 mb-6 px-4 py-2 rounded-2xl bg-gray-600 text-white"
        />

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : showNotFound ? (
          <div className="text-center text-gray-400 mt-6 ">
            <p className="text-lg font-semibold text-white">
              No result for "{debounceSearch}"
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try searching for something else or check the spelling of what you
              typed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4  border-gray-800 rounded-lg"
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
                    <p className="text-white font-semibold">{user.full_name}</p>
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
      <div className="flex flex-col gap-10 w-60 mr-40 ml-10 ">
        <CardProfile className="w-100 bg-neutral-900 rounded p-4" />
        <SuggestedFollow />
      </div>
    </div>
  );
};
