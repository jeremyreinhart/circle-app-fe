import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser, clearUser } from "@/store/userSlice";

export const useAuth = () => {
  const [isAuthDone, setIsAuthDone] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserLogin = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/me", {
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
