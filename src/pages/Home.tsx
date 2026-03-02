import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LeftBar } from "@/components/LeftBar";
import { CardProfile } from "../components/Profile/CardProfile";
import { ThreadCard } from "../components/ThreadCard";
import { useLogout } from "../hooks/userLogout";
import { SuggestedFollow } from "@/components/SugesstedFollow";

export const Home = () => {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen relative">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-white" />
        </button>
        <h1 className="text-green-500 font-bold text-xl">circle</h1>
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-1/5 border-r border-neutral-800">
          <LeftBar userLogout={logout} />
        </div>

        <div className="w-full lg:w-3/5 border-r border-neutral-800">
          <ThreadCard />

          <div className="block lg:hidden p-4 space-y-6">
            <CardProfile my="My Profile" />
            <SuggestedFollow />
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/4 p-5 space-y-6">
          <CardProfile my="My Profile" />
          <SuggestedFollow />
        </div>
      </div>
    </div>
  );
};
