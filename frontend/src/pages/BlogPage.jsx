import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { get } from "../services/ApiEndpoint";
import { TbPointFilled } from "react-icons/tb";
import Header from "../components/common/Header";
import Loading from "../components/common/Loading";
import userimage from "../assets/user.png";
import { BiSolidLike, BiLike } from "react-icons/bi";

const BlogPage = () => {
  const user = useSelector((state) => state.Auth.user);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await get("/api/blog/getAllApprovedBlogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/blog/like/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBlogs();
    } catch (err) {
      console.error("Error liking/unliking the blog:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-[1000px]">
        <div className="bg-white shadow-sm p-10 rounded mb-5 text-red-600 h-[500px] flex items-center justify-center relative">
          <div className="absolute inset-0 bg-[url('src/assets/bloghero.png')] bg-cover bg-center opacity-90 rounded"></div>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <h1 className="text-9xl font-bold opacity-100 mask-image-[linear-gradient(to_right, transparent, transparent 50%, rgba(0,0,0,0.5) 100%)] text-white">
              All Blogs
            </h1>
          </div>
        </div>

        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-sm p-10 rounded mb-5">
            <div
              key={blog._id}
              className="bg-white border-b-1 border-gray-300 py-4 mb-5"
            >
              <div className="flex items-center gap-2">
                <img src={userimage} className="w-12" />
                <div className="flex flex-col">
                <label className="font-bold text-lg">
                  {blog.userId.name || "@Anonymous"}
                </label>
                <label className="text-sm">
                  Author
                </label>
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-semibold mb-2">{blog.title}</h2>
            {blog.blocks.map((block, index) => (
              <div key={index} className="mb-2">
                {/*heading 01*/}
                {block.type === "heading1" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="text-3xl font-bold"
                  />
                )}
                {/*heading 02*/}
                {block.type === "heading2" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="text-2xl font-bold"
                  />
                )}
                {/*heading 03*/}
                {block.type === "heading3" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="text-xl font-bold"
                  />
                )}
                {/*text*/}
                {block.type === "text" && (
                  <div
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="text-lg text-justify leading-7"
                  />
                )}
                {/*bullet Point text*/}
                {block.type === "bulletPoint" && (
                  <div className="flex items-start gap-2">
                    <TbPointFilled size={20} className="mt-1 text-gray-700" />
                    <p className="text-lg leading-7">{block.content}</p>
                  </div>
                )}
                {/*image*/}
                {block.type === "image" && (
                  <div className="relative mb-2 rounded overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
                      style={{ backgroundImage: `url(${block.content})` }}
                    ></div>
                    <div className="relative z-10 flex justify-center p-2">
                      <img
                        src={block.content}
                        alt="blog"
                        className="max-h-[400px] object-contain rounded shadow-lg"
                      />
                    </div>
                  </div>
                )}
                {/*video*/}
                {block.type === "video" && (
                  <video controls className="w-full max-w-lg">
                    <source src={block.content} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
            {(user?.role === "user" || user?.role === "hospital" || user?.role === "superadmin" || user?.role === "admin") && (
              <div className="flex items-center justify-end mt-5">
                <button
                  onClick={() => handleLike(blog._id)}
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                >
                  {blog.likes.includes(user._id) ? (
                    <BiSolidLike size={30} className="text-blue-500" />
                  ) : (
                    <BiLike size={30} className="text-gray-600" />
                  )}
                </button>
                <span className="ml-2 text-gray-600">{blog.likes.length}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
