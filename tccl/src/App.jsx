import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useAuth } from "./pages/AuthContext";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={ isLoggedIn ? <Dashboard /> : <Navigate to="/auth/sign-in" /> }
      />
      <Route
        path="/auth/*"
        element={ isLoggedIn ? <Navigate to="/dashboard/home" /> : <Auth /> }
      />
      <Route path="*" element={<Navigate to="/dashboard/home" />} />
    </Routes>
  );
}

export default App;
