import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { setUser } from "@/store/userSlice";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const Response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setUser(Response.data.data));
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="text-start mb-4">
          <h1 className="text-4xl text-green-700 font-bold">circle</h1>
          <h3 className="text-white font-bold text-3xl mt-2">
            Login to Circle
          </h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <Input
              value={email}
              change={(e) => setEmail(e.target.value)}
              type="text"
              text=" Email*"
            />
            <Input
              value={password}
              change={(e) => setPassword(e.target.value)}
              type="password"
              text=" Password*"
            />
            <Link to="" className="text-white text-end">
              Forgot Password?
            </Link>
            <Button
              clasName="bg-green-800 text-white text-center h-12 w-113 rounded-3xl cursor-pointer hover:bg-green-700 transition duration-200"
              typebut="submit"
              text="Login"
            />
          </div>
        </form>
        <div className="flex mt-2">
          <p className="text-white">Don't have an account yet? </p>
          <Link to="/register" className="text-green-600">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
