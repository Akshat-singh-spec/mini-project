import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/public/LandingPage";
import NotFound from "./pages/public/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import EditDonation from "./pages/donor/EditDonation";
import DonorDonationDetail from "./pages/donor/DonorDonationDetail";

import NgoDashboard from "./pages/ngo/NgoDashboard";
import BrowseDonations from "./pages/ngo/BrowseDonations";
import NgoDonationDetail from "./pages/ngo/NgoDonationDetail";
import MyRequests from "./pages/ngo/MyRequests";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNgos from "./pages/admin/AdminNgos";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDonations from "./pages/admin/AdminDonations";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Donor area */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute roles={["DONOR"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="donations/new" element={<CreateDonation />} />
        <Route path="donations/:id" element={<DonorDonationDetail />} />
        <Route path="donations/:id/edit" element={<EditDonation />} />
      </Route>

      {/* NGO area */}
      <Route
        path="/ngo"
        element={
          <ProtectedRoute roles={["NGO"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<NgoDashboard />} />
        <Route path="donations" element={<BrowseDonations />} />
        <Route path="donations/:id" element={<NgoDonationDetail />} />
        <Route path="requests" element={<MyRequests />} />
      </Route>

      {/* Admin area */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="ngos" element={<AdminNgos />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="donations" element={<AdminDonations />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
