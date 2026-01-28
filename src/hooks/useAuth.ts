import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setUser, clearUser } from "@/store/userSlice";
import { api } from "@/services/api";

export const useAuth = () => {
  const [isAuthDone, setIsAuthDone] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserLogin = async () => {
      try {
        const response = await api.get("/me", {
          withCredentials: true,
        });
        dispatch(setUser(response.data.data));
      } catch (error) {
        dispatch(clearUser());
        console.error(error);
      } finally {
        setIsAuthDone(true);
      }
    };
    fetchUserLogin();
  }, [dispatch]);
  return { isAuthDone };
};
