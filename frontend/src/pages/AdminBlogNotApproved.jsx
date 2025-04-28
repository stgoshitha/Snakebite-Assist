import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogContentPreview from "../components/BlogContentPreview ";
import { BsCheck2Circle } from "react-icons/bs";
import { MdExpandMore } from "react-icons/md";
import AdminLoading from "../components/common/AdminLoading";
import SideBar from "../components/common/SideBar";
import Header from "../components/common/Header";

const AdminBlogNotApproved = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});
  const [loading, setLoading] = useState(true);

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

  if (loading) return <AdminLoading />;

  return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-70 flex flex-col gap-2 overflow-auto w-full h-screen">
        <Header />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Pending Approval Blogs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse bg-white shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 border-b ">#</th>
                  <th className="py-2 px-4  border-b text-left ">Title</th>
                  <th className="py-2 px-4 border-b text-left ">User</th>
                  <th className="py-2 px-4 border-b w-48">View More</th>
                  <th className="py-2 px-4 border-b w-48">Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <React.Fragment key={blog._id}>
                    <tr className="text-center hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-left">
                        {blog.title}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {blog.userId?.name}
                      </td>
                      <td className="py-2 px-4 border-b ">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 w-32 rounded"
                          onClick={() => toggleExpanded(blog._id)}
                        >
                          <MdExpandMore
                            className={`inline mr-2 transition-transform duration-300 ${
                              expandedBlog === blog._id ? "rotate-180" : ""
                            }`}
                          />
                          {expandedBlog === blog._id
                            ? "View Less"
                            : "View More"}
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => approveBlog(blog._id)}
                        >
                          <BsCheck2Circle size={20} className="inline mr-1" />
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
