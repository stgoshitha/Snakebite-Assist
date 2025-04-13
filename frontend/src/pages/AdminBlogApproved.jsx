import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogContentPreview from "../components/BlogContentPreview ";
import { MdExpandMore } from "react-icons/md";

const AdminBlogApproved = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});
  const [sortByLikes, setSortByLikes] = useState(false); // state to control sorting

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Approved Blogs</h2>
      </div>

      <table className="min-w-full table-fixed border-collapse bg-white shadow-md rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-b py-2 px-4">#</th>
            <th className="border-b py-2 px-4 text-left">Title</th>
            <th className="border-b py-2 px-4">Author</th>
            <th className="border-b py-2 px-4 ">
              <div className="flex flex-col items-center justify-center space-x-2">
                Like Count{" "}
                <label className="flex jusify-center items-center space-x-2">
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
          {sortedBlogs.map((blog, index) => (
            <React.Fragment key={blog._id}>
              <tr className="text-center hover:bg-gray-50">
                <td className="border-b py-2 px-4">{index + 1}</td>
                <td className="border-b py-2 px-4 text-left">{blog.title}</td>
                <td className="border-b py-2 px-4">{blog.userId?.name}</td>
                <td className="border-b py-2 px-4">
                  {blog.likes?.length || 0}
                </td>
                <td className="border-b py-2 px-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 w-32 rounded"
                    onClick={() => toggleExpanded(blog._id)}
                  >
                    <MdExpandMore className="inline mr-1" />
                    {expandedBlog === blog._id ? "View Less" : "View More"}
                  </button>
                </td>
              </tr>
              {expandedBlog === blog._id && (
                <tr>
                  <td colSpan="5" className="p-4 bg-gray-50">
                    <BlogContentPreview blogDetail={blogDetails[blog._id]} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogApproved;
