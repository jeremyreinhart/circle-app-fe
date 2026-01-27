import { LeftBar } from "@/components/LeftBar";
import { CardProfile } from "../components/Profile/CardProfile";
import { ThreadCard } from "../components/ThreadCard";

import { useLogout } from "../hooks/userLogout";
import { SugesstedFollow } from "@/components/SugesstedFollow";

export const Home = () => {
  const logout = useLogout();
  return (
    <div className="bg-black min-h-screen flex gap-3 pt-5">
      <LeftBar userLogout={logout} />
      <ThreadCard />
      <div className="flex flex-col gap-10">
        <CardProfile />
        <SugesstedFollow />
      </div>
    </div>
  );
};
