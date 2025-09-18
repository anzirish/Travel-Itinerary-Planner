import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Trips from "./pages/Trips";

function App() {
  return (
    <>
      <div className="min-h-screen">
        <header>
          <div className="bg-white shadow-sm p-4">
            <div className="container mx-auto flex items-center justify-between">
              <Link to="/trips" className="text-2xl font-semibold">
                Travel Planner
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Trips />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trip/:id" element={<Trips />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
