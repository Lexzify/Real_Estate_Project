import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Home from "./pages/Home";
import HostDashboard from "./pages/HostDashboard";
import Login from "./pages/Login";
import PropertyDetails from "./pages/PropertyDetails";
import Register from "./pages/Register";
import TravelerDashboard from "./pages/TravelerDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-slate-900">
      <Toaster position="top-center" />
      <div className="pointer-events-none fixed inset-x-0 top-[-220px] z-0 h-[460px] bg-[radial-gradient(circle_at_30%_35%,rgba(255,197,202,0.55),transparent_56%)]" />
      <div className="pointer-events-none fixed -right-28 top-[28%] z-0 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />
      <Navbar />
      <main className="layout-shell relative z-10 pb-16 pt-6 sm:pt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route
            path="/host-dashboard"
            element={
              <ProtectedRoute role="host">
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/traveler-dashboard"
            element={
              <ProtectedRoute role="traveler">
                <TravelerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/create"
            element={
              <ProtectedRoute role="host">
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/:id/edit"
            element={
              <ProtectedRoute role="host">
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="layout-shell relative z-10 border-t border-[#e8e2da] py-6 text-center text-xs text-[#756d66] sm:text-sm">
        Lexzify Properties • Crafted for hosts and travelers
      </footer>
    </div>
  );
}

export default App;
