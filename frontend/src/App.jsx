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
import { TransliterationProvider } from './context/TransliterationContext';

function App() {
  return (
    <SnakesContextProvider>
      <TransliterationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/snake-details" element={<SnakeDetails />} />
                <Route path="/snake-details/:id" element={<SnakeDetail />} />
                <Route path="/register-hospital" element={<CreateHospitalForm />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard/users" element={<AdminDashboardUsers />} />
                  <Route path="dashboard/admins" element={<AdminDashboardAdmins />} />
                  <Route path="dashboard/add-admin" element={<AddNewAdmin />} />
                  <Route path="dashboard/hospitals/approved" element={<AdminHospitalApproved />} />
                  <Route path="dashboard/hospitals/not-approved" element={<AdminHospitalNotApproved />} />
                  <Route path="snake-details" element={<SnakeDetails />} />
                  <Route path="snake-details/:id" element={<SnakeDetail />} />
                </Route>
                
                <Route path="/hospital" element={<HospitalLayout />}>
                  <Route path="dashboard" element={<HospitalDashboard />} />
                  <Route path="profile" element={<HospitalProfile />} />
                </Route>
                
                <Route path="/user" element={<UserLayout />}>
                  {/* User routes go here */}
                </Route>
                
                <Route path="/public" element={<PublicLayout />}>
                  {/* Public routes go here */}
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </TransliterationProvider>
    </SnakesContextProvider>
  );
}

export default App;
