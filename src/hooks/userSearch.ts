import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useSelector } from "react-redux";
import type { UserState } from "@/store/userSlice";
import { socket } from "@/socket";

type FollowingUser = {
  id: number;
  username: string;
  full_name: string;
  photo_profile: string | null;
};

type FollowActionPayload = {
  followerId: number;
  followingId: number;
  action: "follow" | "unfollow";
};

export type UserWithFollowStatus = UserState & {
  is_following: boolean;
};

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithFollowStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state: { user: UserState }) => state.user);

  // Fetch all users & merge follow status
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const usersRes = await api.get("/user");
        const followingRes = await api.get("/follows?type=following", {
          withCredentials: true,
        });

        const followingIds = new Set(
          followingRes.data.data.following?.map((f: FollowingUser) => f.id) ||
            [],
        );

        const merged = usersRes.data.data.map((user: UserState) => ({
          ...user,
          is_following: user.id ? followingIds.has(user.id) : false,
        }));

        setUsers(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!currentUser.id) return;

    socket.emit("join-user", currentUser.id);

    const handleFollowAction = (data: FollowActionPayload) => {
      // Update state Search
      if (data.followerId === currentUser.id) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === data.followingId
              ? { ...u, is_following: data.action === "follow" }
              : u,
          ),
        );
      }
    };

    socket.on("follow-action", handleFollowAction);

    return () => {
      socket.off("follow-action", handleFollowAction);
    };
  }, [currentUser.id]);

  // Follow user + emit socket
  const followUser = async (userId: number | null) => {
    if (!userId) return;

    await api.post("/follows", { user_id: userId }, { withCredentials: true });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_following: true } : u)),
    );

    socket.emit("follow-action", {
      followerId: currentUser.id,
      followingId: userId,
      action: "follow",
    });
  };

  const unfollowUser = async (userId: number | null) => {
    if (!userId) return;

    await api.delete("/follows", {
      data: { user_id: userId },
      withCredentials: true,
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_following: false } : u)),
    );

    socket.emit("follow-action", {
      followerId: currentUser.id,
      followingId: userId,
      action: "unfollow",
    });
  };

  return { users, loading, followUser, unfollowUser };
};
