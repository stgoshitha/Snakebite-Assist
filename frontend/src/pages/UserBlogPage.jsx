import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import BlogContentPreview from "../components/BlogContentPreview ";

const UserBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?._id;
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("User information is missing.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/api/blog/getAllBlogByUserId/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const fetchBlogDetails = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/blog/usergetBlogByBlogId/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlogDetails((prev) => ({ ...prev, [blogId]: res.data }));
    } catch (error) {
      console.error("Error fetching blog details:", error);
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

  const handleDeleteBlog = async (blogId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/blog/deletBlog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete the blog.");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <div className="flex flex-col gap-4">
          {blogs.map((blog) => (
            <div key={blog._id}>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded cursor-pointer"
                      onClick={() => toggleExpanded(blog._id)}
                    >
                      <FiEye
                        size={20}
                        className="text-blue-500 hover:text-blue-600"
                      />
                    </button>
                    <button
                      className="px-4 py-2 rounded cursor-pointer"
                      onClick={() => alert(`Editing blog: ${blog.title}`)}
                    >
                      <FiEdit
                        size={20}
                        className="text-green-500 hover:text-green-600"
                      />
                    </button>
                    <button
                      className="px-4 py-2 rounded cursor-pointer"
                      onClick={() => handleDeleteBlog(blog._id)}
                    >
                      <FiTrash2
                        size={20}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
                  </div>
                </div>
              </div>
              {expandedBlog === blog._id && (
                <div className="mt-2 bg-gray-50">
                  <BlogContentPreview blogDetail={blogDetails[blog._id]} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogPage;
