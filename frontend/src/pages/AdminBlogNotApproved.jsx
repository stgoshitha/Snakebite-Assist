import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogContentPreview from "../components/BlogContentPreview ";
import { BsCheck2Circle } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AdminLoading from "../components/common/AdminLoading";
import SideBar from "../components/common/SideBar";
import Header from "../components/common/Header";

const AdminBlogNotApproved = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  // Fetch all not approved blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/blog/getAllNotApprovedBlogs",
        { withCredentials: true }
      );
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details of a blog by its ID
  const fetchBlogDetails = async (blogId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/blog/getBlogByBlogId/${blogId}`,
        { withCredentials: true }
      );
      setBlogDetails((prev) => ({ ...prev, [blogId]: res.data }));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blog details");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const approveBlog = async (blogId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/blog/approveBlog/${blogId}`,
        {},
        { withCredentials: true }
      );
      alert("Blog approved!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to approve blog");
    }
  };

  const toggleExpanded = (blogId) => {
    if (expandedBlog === blogId) {
      setExpandedBlog(null);
    } else {
      setExpandedBlog(blogId);
      if (!blogDetails[blogId]) fetchBlogDetails(blogId);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLoading />;

  return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-70 flex flex-col gap-2 overflow-auto w-full h-screen">
        <Header />
        <div className="p-4 flex flex-col gap-2 bg-gray-100 h-screen overflow-auto">
          <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold">Pending Approval Blogs</h2>
          </div>
          <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm">
            <input
              type="text"
              placeholder="Search by Author Name..."
              className="border border-gray-300 rounded-md p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="min-w-full table-fixed border-collapse bg-white shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 border-b">#</th>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Author</th>
                  <th className="py-2 px-4 border-b w-48">View More</th>
                  <th className="py-2 px-4 border-b w-48">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <React.Fragment key={blog._id}>
                    <tr className="text-center hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-left">
                        {blog.title}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {blog.userId?.name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div
                          className="flex justify-center text-blue-600 rounded cursor-pointer"
                          onClick={() => toggleExpanded(blog._id)}
                        >
                          {expandedBlog === blog._id ? (
                            <FiEyeOff
                              size={25}
                              className="text-blue-500 hover:text-blue-600"
                            />
                          ) : (
                            <FiEye
                              size={25}
                              className="text-blue-500 hover:text-blue-600"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="text-green-500 px-3 py-1 cursor-pointer"
                          onClick={() => approveBlog(blog._id)}
                        >
                          <BsCheck2Circle
                            size={25}
                            className="inline font-bold"
                          />
                        </button>
                      </td>
                    </tr>
                    {expandedBlog === blog._id && (
                      <tr>
                        <td colSpan="5" className="p-4 bg-gray-50">
                          <BlogContentPreview
                            blogDetail={blogDetails[blog._id]}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogNotApproved;
