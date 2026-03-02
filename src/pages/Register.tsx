import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "@/services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/user/register", {
        username,
        full_name: fullName,
        email,
        password,
      });
      alert("Register sucessful");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 sm:px-6">
      <div className="w-full max-w-md  p-6 sm:p-8 rounded-2xl shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl text-green-600 font-bold">
            circle
          </h1>
          <h3 className="text-white font-semibold text-xl sm:text-2xl mt-2">
            Create account Circle
          </h3>
        </div>

        <form onSubmit={handleRegister}>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              text=" Username *"
              value={username}
              change={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              text=" Full Name *"
              value={fullName}
              change={(e) => setFullName(e.target.value)}
            />
            <Input
              type="text"
              text=" Email *"
              value={email}
              change={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              text=" Password *"
              value={password}
              change={(e) => setPassword(e.target.value)}
            />

            <Button
              clasName="bg-green-700 text-white h-12 w-full rounded-3xl cursor-pointer hover:bg-green-600 transition duration-200"
              typebut="submit"
              text="Create"
            />
          </div>
        </form>

        <div className="flex flex-wrap gap-1 mt-4 text-sm">
          <p className="text-white">Already have account?</p>
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
