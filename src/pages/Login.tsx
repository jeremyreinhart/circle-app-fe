import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "@/services/api";
import { setUser } from "@/store/userSlice";
import type { RootState } from "@/store/store";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (user && user.id) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }

    try {
      const response = await api.post(
        "/user/login",
        { email, password },
        { withCredentials: true },
      );

      // Simpan user ke Redux
      dispatch(setUser(response.data.data));

      // Redirect ke home
      navigate("/home");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Login gagal. Cek email dan password.",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md p-5">
        <div className="text-start mb-6">
          <h1 className="text-4xl text-green-700 font-bold">circle</h1>
          <h3 className="text-white font-bold text-3xl mt-2">
            Login to Circle
          </h3>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Input
            value={email}
            change={(e) => setEmail(e.target.value)}
            type="email"
            text="Email*"
          />
          <Input
            value={password}
            change={(e) => setPassword(e.target.value)}
            type="password"
            text="Password*"
          />

          <Link to="#" className="text-white text-end text-sm">
            Forgot Password?
          </Link>

          <Button
            clasName="bg-green-800 text-white text-center h-12 w-full rounded-3xl cursor-pointer hover:bg-green-700 transition duration-200"
            typebut="submit"
            text="Login"
          />
        </form>

        <div className="flex mt-4 gap-1">
          <p className="text-white">Don't have an account yet?</p>
          <Link to="/register" className="text-green-600">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
