import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import HospitalLayout from "./layouts/HospitalLayout";
import UserLayout from "./layouts/UserLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import AdminDashboardUsers from "./pages/AdminDashboardUsers";
import HospitalDashboard from "./pages/HospitalDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHospitalApproved from "./pages/AdminHospitalApproved";
import AdminHospitalNotApproved from "./pages/AdminHospitalNotApproved";
import HospitalProfile from "./pages/HospitalProfile";
import CreateHospitalForm from "./pages/CreateHospitalForm";


function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path='adminUsers' element={<AdminDashboardUsers />} />
            <Route path='adminHospitalApproved' element={<AdminHospitalApproved />} />
            <Route path='adminHospitalNotApproved' element={<AdminHospitalNotApproved />} />
          </Route>

          <Route path='/' element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/hospital" element={<HospitalLayout />}>
            <Route index element={<Home />} />
            <Route path="hospitaldash" element={<HospitalDashboard />} />
            <Route path="hospitalprofile" element={<HospitalProfile />} />
            <Route path="hospitalprofile/createHospitalForm" element={<CreateHospitalForm />} />
          </Route>

          <Route path='/' element={<PublicLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;