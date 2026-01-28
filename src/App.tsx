import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import PrivateRoute from "./lib/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { Profile } from "./pages/Profile";
import { Follows } from "./pages/Follows";
import { Search } from "./pages/Search";

function App() {
  const { isAuthDone } = useAuth();

  if (!isAuthDone) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-green-500">
        <p className="text-xl font-bold animate-pulse">Loading...</p>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/follows"
            element={
              <PrivateRoute>
                <Follows />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
