import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../store/userSlice";
import axios from "axios";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/logout",
        {},
        { withCredentials: true },
      );
      dispatch(clearUser());
      if (res.status === 200) navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};
