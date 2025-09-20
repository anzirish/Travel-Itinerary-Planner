import { Route, Routes } from "react-router-dom";
import "./App.css";
import Trips from "./pages/Trips";
import Trip from "./pages/Trip";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/:id"
            element={
              <ProtectedRoute>
                <Trip />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
