import { Link } from "react-router-dom";
import { ArrowLeftFromLine, House, User } from "lucide-react";
import { Button } from "@/components/Button";
import { Heart, UserSearch } from "lucide-react";

interface Props {
  userLogout: () => void;
}

export const LeftBar = ({ userLogout }: Props) => {
  return (
    <div className="sticky top-0 h-dvh overflow-y-auto pt-6 px-6 flex flex-col gap-6">
      <h1 className="text-4xl lg:text-5xl text-green-500 font-bold">circle</h1>

      <Link
        to="/home"
        className="text-white text-lg hover:text-green-500 transition flex gap-2"
      >
        <House /> Home
      </Link>

      <Link
        to="/search"
        className="text-white text-lg flex gap-2 hover:text-green-500 transition"
      >
        <UserSearch /> Search
      </Link>

      <Link
        to="/follows"
        className="text-white text-lg flex gap-2 hover:text-green-500 transition"
      >
        <Heart /> Follow
      </Link>

      <Link
        to="/profile"
        className="text-white text-lg hover:text-green-500 transition flex gap-2"
      >
        <User /> Profile
      </Link>

      <Button
        clasName="bg-green-700 text-white h-12 w-full rounded-full hover:bg-green-600 transition"
        typebut="submit"
        text="Create Post"
      />

      <button
        onClick={userLogout}
        className="text-white flex items-center gap-2 mt-auto hover:bg-neutral-800 p-2 rounded-lg transition"
      >
        <ArrowLeftFromLine />
        Logout
      </button>
    </div>
  );
};
