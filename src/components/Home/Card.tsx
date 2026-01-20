import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  photo_profile?: string;
}

export const CardProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/user/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        return error;
      }
    };

    getUser();
  }, []);

  if (!user) return <p className="text-white">User not found</p>;

  return (
    <Card className="bg-neutral-900 border border-neutral-900 mt-4">
      <CardHeader className="w-full">
        <CardTitle className="text-white text-xl">My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-100 max-w-xl bg-neutral-900 rounded-xl ">
          <div className="relative h-32 bg-amber-400 from-lime-300 via-yellow-300 to-amber-300 rounded-t-xl">
            <img
              src={
                user.photo_profile ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s"
              }
              alt="profile"
              className="w-20 h-20 rounded-full border-4 border-neutral-900 absolute -bottom-10 left-6 object-cover"
            />
          </div>

          <div className="flex justify-end mt-12">
            <button className="px-4 py-1 text-sm rounded-full border border-neutral-400 text-neutral-200 hover:bg-neutral-800">
              Edit Profile
            </button>
          </div>

          <div className="mt-4 ml-6">
            <p className="text-white font-semibold text-xl">
              🌟{user.full_name}🌟
            </p>
            <p className="text-gray-400 mt-2">@{user.username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
