import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogContentPreview from "../components/BlogContentPreview ";
import AdminLoading from "../components/common/AdminLoading";
import SideBar from "../components/common/SideBar";
import Header from "../components/common/Header";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AdminBlogApproved = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});
  const [sortByLikes, setSortByLikes] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <- new state for search
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/blog/getAllApprovedBlogs"
        );
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch approved blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedBlogs();
  }, []);

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

  const toggleExpanded = (blogId) => {
    if (expandedBlog === blogId) {
      setExpandedBlog(null);
    } else {
      setExpandedBlog(blogId);
      if (!blogDetails[blogId]) fetchBlogDetails(blogId);
    }
  };

  const sortedBlogs = sortByLikes
    ? [...blogs].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    : blogs;

  const filteredBlogs = sortedBlogs.filter((blog) =>
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
        <div className="p-4 flex flex-col gap-2 bg-gray-100 h-screen overflow-auto ">
          <div className="flex flex-col tems-center justify-between gap-4 w-full">
            <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm md:w-auto w-full">
              <h2 className="text-2xl font-bold">Approved Blogs</h2>
            </div>
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
                  <th className="border-b py-2 px-4">#</th>
                  <th className="border-b py-2 px-4 text-left">Title</th>
                  <th className="border-b py-2 px-4 text-left">Author</th>
                  <th className="border-b py-2 px-4">
                    <div className="flex flex-col items-center justify-center space-x-2">
                      Like Count{" "}
                      <label className="flex justify-center items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={sortByLikes}
                          onChange={() => setSortByLikes(!sortByLikes)}
                          className="accent-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Sort by Like Count
                        </span>
                      </label>
                    </div>
                  </th>
                  <th className="border-b py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog, index) => (
                    <React.Fragment key={blog._id}>
                      <tr className="text-center hover:bg-gray-50">
                        <td className="border-b py-2 px-4">{index + 1}</td>
                        <td className="border-b py-2 px-4 text-left">
                          {blog.title}
                        </td>
                        <td className="border-b py-2 px-4 text-left">
                          {blog.userId?.name}
                        </td>
                        <td className="border-b py-2 px-4">
                          {blog.likes?.length || 0}
                        </td>
                        <td className="border-b py-2 px-4">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No blogs found for "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogApproved;
