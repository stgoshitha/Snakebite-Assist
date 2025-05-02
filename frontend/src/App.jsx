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
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHospitalApproved from "./pages/AdminHospitalApproved";
import AdminHospitalNotApproved from "./pages/AdminHospitalNotApproved";
import HospitalProfile from "./pages/HospitalProfile";
import CreateHospitalForm from "./pages/CreateHospitalForm";
import SnakeDetails from './pages/SnakeDetails';
import SnakeDetail from './components/snakes/SnakeDetail';
import BlogPage from "./pages/BlogPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import AdminBlogApproved from "./pages/AdminBlogApproved";
import AdminBlogNotApproved from "./pages/AdminBlogNotApproved";
import UserBlogPage from "./pages/UserBlogPage";
import BlogUpdatePage from "./pages/BlogUpdatePage";
import NearestHospital from "./pages/NearestHospital";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto">
          <Routes>
            <Route path='/admin' element={<AdminLayout />}>
              <Route index element={<Home />} />
              <Route path='adminUsers' element={<AdminDashboardUsers />} />
              <Route path='allAdmins' element={<AdminDashboardAdmins />} />
              <Route path='allAdmins/addAdminForm' element={<AddNewAdmin />} />
              <Route path='adminHospitalApproved' element={<AdminHospitalApproved />} />
              <Route path='adminHospitalNotApproved' element={<AdminHospitalNotApproved />} />
              <Route path='adminBlogApproved' element={<AdminBlogApproved />} />
              <Route path='adminBlogNotApproved' element={<AdminBlogNotApproved />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/createBlog" element={<BlogCreatePage />} />
              <Route path="userBlog" element={<UserBlogPage />} />
            </Route>

            <Route path='/' element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="userBlog/createBlog" element={<BlogCreatePage />} />
              <Route path="userBlog" element={<UserBlogPage />} />
              <Route path="userBlog/update-blog/:blogId" element={<BlogUpdatePage />} />
              <Route path="nearestHospital" element={<NearestHospital />} />
            </Route>

            <Route path="/hospital" element={<HospitalLayout />}>
              <Route index element={<Home />} />
              <Route path="hospitalprofile" element={<HospitalProfile />} />
              <Route path="hospitalprofile/createHospitalForm" element={<CreateHospitalForm />} />
              <Route path="nearestHospital" element={<NearestHospital />} />
            </Route>

            <Route path='/' element={<PublicLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="blogs" element={<BlogPage />} />
              <Route path="user/nearestHospital" element={<NearestHospital />} />
            </Route>

            <Route path="/admin/snake-details" element={<SnakeDetails />} />
            <Route path="/admin/snake-details/:id" element={<SnakeDetail />} />
            
          </Routes>
        </main>
      </div>
      </Router>
  );
}

export default App;
