import { Link } from "react-router-dom";
import { ArrowLeftFromLine } from "lucide-react";
import { Button } from "@/components/Button";
import { Heart, UserSearch } from "lucide-react";

interface Props {
  userLogout: () => void;
}

export const LeftBar = ({ userLogout }: Props) => {
  return (
    <div className="pt-4 flex flex-col gap-5 ml-5 min-h-screen w-65 fixed top-0 left-0">
      <h1 className="text-6xl text-green-500 font-bold">circle</h1>
      <div>
        <Link to="/home" className=" text-decoration-none text-white text-xl">
          <i className="bi bi-house-door-fill text-xl"></i> Home
        </Link>
      </div>
      <div>
        <Link
          to=""
          className=" text-decoration-none text-white text-xl flex gap-1"
        >
          <UserSearch /> Search
        </Link>
      </div>
      <div>
        <Link
          to=""
          className=" text-decoration-none text-white text-xl flex gap-1"
        >
          <Heart color="white" /> Follow
        </Link>
      </div>
      <div>
        <Link
          to="/profile"
          className=" text-decoration-none text-white text-xl"
        >
          <i className="bi bi-person-circle text-xl"></i> Profile
        </Link>
      </div>
      <Button
        clasName="bg-green-800 text-white text-center h-12 w-55 rounded-3xl cursor-pointer hover:bg-green-700 transition duration-200"
        typebut="submit"
        text="Create Post"
      />
      <button
        onClick={userLogout}
        className="text-white cursor-pointer w-25 hover:bg-neutral-800 flex rounded-xl mt-90"
      >
        <ArrowLeftFromLine />
        <span>Logout</span>
      </button>
    </div>
  );
};
