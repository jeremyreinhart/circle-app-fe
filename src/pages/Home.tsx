import { Button } from "@/components/Button";
import { CardProfile } from "@/components/Home/Card";
import { ThreadCard } from "@/components/Home/ThreadCard";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-black min-h-screen flex gap-3">
      {/* left */}
      <div className="pt-4 flex flex-col gap-4 ml-4">
        <h1 className="text-5xl text-green-500 font-bold">circle</h1>
        <div>
          <Link to="/home" className=" text-decoration-none text-white text-xl">
            <i className="bi bi-house-door-fill text-xl"></i> Home
          </Link>
        </div>
        <div>
          <Link to="" className=" text-decoration-none text-white text-xl">
            <i className="bi bi-search text-xl"></i> Search
          </Link>
        </div>
        <div>
          <Link to="" className=" text-decoration-none text-white text-xl">
            <i className="bi bi-heart text-xl"></i> Follows
          </Link>
        </div>
        <div>
          <Link to="" className=" text-decoration-none text-white text-xl">
            <i className="bi bi-person-circle text-xl"></i> Profile
          </Link>
        </div>
        <Button
          clasName="bg-green-800 text-white text-center h-12 w-55 rounded-3xl cursor-pointer hover:bg-green-700 transition duration-200"
          typebut="submit"
          text="Create Post"
        />
      </div>
      <ThreadCard />
      <div>
        <CardProfile />
      </div>
    </div>
  );
};
