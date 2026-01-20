import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/v1/user/register", {
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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="text-start mb-4">
          <h1 className="text-4xl text-green-700 font-bold">circle</h1>
          <h3 className="text-white font-semibold text-2xl mt-2">
            Create account Circle
          </h3>
        </div>
        <form onSubmit={handleRegister}>
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              text=" username *"
              value={username}
              change={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              text=" FullName *"
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
              clasName="bg-green-800 text-white text-center h-12 w-113 rounded-3xl cursor-pointer hover:bg-green-700 transition duration-200"
              typebut="submit"
              text="Create"
            />
          </div>
        </form>
        <div className="flex mt-2">
          <p className="text-white">Already have account? </p>
          <Link to="/login" className="text-green-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
