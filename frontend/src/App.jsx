import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import HospitalLayout from "./layouts/HospitalLayout";
import UserLayout from "./layouts/UserLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import AdminDashboardUsers from "./pages/AdminDashboardUsers";
import AdminDashboardAdmins from "./pages/AdminDashboardAdmins";
import AddNewAdmin from "./pages/AddNewAdmin";
import AdminHospitalApproved from "./pages/AdminHospitalApproved";
import AdminHospitalNotApproved from "./pages/AdminHospitalNotApproved";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalProfile from "./pages/HospitalProfile";
import CreateHospitalForm from "./pages/CreateHospitalForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SnakeDetails from "./pages/SnakeDetails";
import SnakeDetail from "./components/snakes/SnakeDetail";
import 'leaflet/dist/leaflet.css';
import './styles/leaflet.css';
import { SnakesContextProvider } from './context/SnakesContext';

function App() {
  return (
    <SnakesContextProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <main className="container mx-auto px-4 py-8">
            <Routes>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Home />} />
                <Route path="adminUsers" element={<AdminDashboardUsers />} />
                <Route path="allAdmins" element={<AdminDashboardAdmins />} />
                <Route path="allAdmins/addAdminForm" element={<AddNewAdmin />} />
                <Route path="adminHospitalApproved" element={<AdminHospitalApproved />} />
                <Route path="adminHospitalNotApproved" element={<AdminHospitalNotApproved />} />
                <Route path="snake-details" element={<SnakeDetails />} />
                <Route path="snake-details/province/:province" element={<SnakeDetails />} />
                <Route path="snake-details/:id" element={<SnakeDetail />} />
              </Route>

              {/* Hospital Routes */}
              <Route path="/hospital" element={<HospitalLayout />}>
                <Route index element={<Home />} />
                <Route path="hospitaldash" element={<HospitalDashboard />} />
                <Route path="hospitalprofile" element={<HospitalProfile />} />
                <Route path="hospitalprofile/createHospitalForm" element={<CreateHospitalForm />} />
              </Route>

              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

            </Routes>
          </main>
        </div>
      </Router>
    </SnakesContextProvider>
  );
}

export default App;
