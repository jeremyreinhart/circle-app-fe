import { LeftBar } from "@/components/LeftBar";
import { CardProfile } from "../components/Profile/CardProfile";
import { ThreadCard } from "../components/ThreadCard";

import { useLogout } from "../hooks/userLogout";
import { SuggestedFollow } from "@/components/SugesstedFollow";

export const Home = () => {
  const logout = useLogout();
  return (
    <div className="bg-black min-h-screen w-full flex gap-3 pt-5">
      <LeftBar userLogout={logout} />
      <ThreadCard />
      <div className="flex flex-col gap-10 w-60 mr-50 ">
        <CardProfile
          className="w-100 bg-neutral-900 rounded p-4"
          my={"My Profile"}
        />
        <SuggestedFollow />
      </div>
    </div>
  );
};
