import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import BlogContentPreview from "../components/BlogContentPreview ";
import Header from "../components/common/Header";
import Loading from "../components/common/Loading";
import { IoAdd } from "react-icons/io5";
import { BiSolidLike } from "react-icons/bi";

const UserBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});
  const navigate = useNavigate();

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

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-[1000px]">
        <div className="flex items-center justify-center bg-gradient-to-r from-[#557512] to-[#d5aa54] text-white shadow-sm p-10 rounded mb-4">
          <h2 className="text-9xl font-bold">MY BLOGS</h2>
        </div>
        {blogs.length === 0 ? (
          <div className="bg-white shadow-sm p-3 rounded mb-4">
            <p>No blogs found</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/userBlog/createBlog")}
            >
              Create New Blog
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end w-full">
              <Link
                to="/userBlog/createBlog"
                className="bg-[#0f1600] hover:bg-[#6a4c11] text-white px-3 py-2 rounded"
              >
                <div className="flex items-center justify-center gap-1 font-bold">
                  <IoAdd size={20} /> <label>Create New Blog</label>
                </div>
              </Link>
            </div>
            {blogs.map((blog) => (
              <div key={blog._id}>
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                  <div className="flex items-center justify-between mb-5 border-b-2 border-gray-300 pb-3 pl-3">
                    <div >
                      {(() => {
                        const createdAt = new Date(blog.createdAt);
                        const date = createdAt.toLocaleDateString();
                        const time = createdAt.toLocaleTimeString();
                        return (
                          <div className="flex items-center gap-2 text-sm">
                            <div>{date}</div> 
                            <div>{time}</div>
                          </div>
                        );
                      })()}
                    </div>
                    <div
                      className={
                        blog.isApproved
                          ? "text-green-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
                          : "text-red-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
                      }
                    >
                      {blog.isApproved ? "Approved" : "Not Approved"}
                    </div>
                  </div>
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
                        onClick={() =>
                          navigate(`/userBlog/update-blog/${blog._id}`)
                        }
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
                  <div className="flex items-center justify-end mt-5">
                                  <button
                                   
                                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                                  >
                                      <BiSolidLike size={15} className="text-blue-500" />
                                  </button>
                                  <span className="ml-2 text-gray-600">{blog.likes.length}</span>
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
    </div>
  );
};

export default UserBlogPage;
