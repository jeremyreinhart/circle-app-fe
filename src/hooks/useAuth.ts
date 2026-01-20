import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.user);
  return { user };
};
