import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/common/Header";
import Loading from "../components/common/Loading";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";

const BlogUpdatePage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
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
        setBlog(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedBlocks = [...blog.blocks];
    updatedBlocks[index].content = value;
    setBlog({ ...blog, blocks: updatedBlocks });
  };

  const handleTitleChange = (e) => {
    setBlog({ ...blog, title: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/api/blog/updateBlog/${blogId}`,
        blog,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Blog updated successfully!");
      navigate("/userBlog");
    } catch (error) {
      console.error(error);
      alert("Failed to update blog");
    } finally {
      setUpdating(false);
    }
  };

  //Function to add new block
  const addBlock = (type) => {
    const newBlock = { type, content: "" };
    setBlog({ ...blog, blocks: [...blog.blocks, newBlock] });
  };

  //Function to remove a block (optional, if you want remove option also)
  const removeBlock = (index) => {
    const updatedBlocks = [...blog.blocks];
    updatedBlocks.splice(index, 1);
    setBlog({ ...blog, blocks: updatedBlocks });
  };

  if (loading) return <Loading/>;

  if (!blog) {
    return <div className="text-center p-10">Blog not found</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-[1000px]">
        <div className="flex items-center justify-center bg-green-500 text-white shadow-sm p-10 rounded mb-4">
          <h2 className="text-9xl font-bold">UPDATE BLOG</h2>
        </div>
        <div className="bg-white shadow-sm p-3 rounded mb-4">
          <label className="text-gray-600">Title</label>
          <input
            type="text"
            value={blog.title}
            onChange={handleTitleChange}
            className="border w-full p-2 text-2xl font-bold rounded"
          />
        </div>

        {blog.blocks.map((block, index) => (
          <div key={index} className="bg-white shadow-sm p-3 rounded mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-600">
                {block.type === "heading1"
                  ? "Heading 1"
                  : block.type === "heading2"
                  ? "Heading 2"
                  : block.type === "heading3"
                  ? "Heading 3"
                  : block.type === "text"
                  ? "Text Content"
                  : block.type === "bulletPoint"
                  ? "Bullet Point"
                  : block.type === "image"
                  ? "Image"
                  : "Video"}
              </label>
              <button
                type="button"
                className="text-red-600"
                onClick={() => removeBlock(index)}
              >
                <IoIosClose size={30} />
              </button>
            </div>

            {(block.type === "heading1" ||
              block.type === "heading2" ||
              block.type === "heading3" ||
              block.type === "text" ||
              block.type === "bulletPoint") && (
              <textarea
                value={block.content}
                onChange={(e) => handleInputChange(e, index)}
                className="border w-full p-2 rounded min-h-[100px]"
                placeholder="Enter content..."
              />
            )}

            {(block.type === "image" || block.type === "video") && (
              <>
                <div className="relative z-10 flex justify-center p-2">
                  {block.type === "image" ? (
                    <img
                      src={block.content}
                      alt="blog"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/400x200?text=Image+Not+Found";
                      }}
                      className="max-h-[400px] object-contain rounded shadow-lg"
                    />
                  ) : block.type === "video" ? (
                    <video
                      controls
                      className="max-h-[400px] object-contain rounded shadow-lg"
                      width="100%"
                    >
                      <source src={block.content} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => handleInputChange(e, index)}
                  className="border w-full p-2 rounded"
                  placeholder={
                    block.type === "image"
                      ? "Enter image URL"
                      : "Enter video URL"
                  }
                />
              </>
            )}
          </div>
        ))}

        {/* Add Block Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => addBlock("heading1")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <LuHeading1 size={30} />
          </button>
          <button
            onClick={() => addBlock("heading2")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <LuHeading2 size={25} />
          </button>
          <button
            onClick={() => addBlock("heading3")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <LuHeading3 size={20} />
          </button>
          <button
            onClick={() => addBlock("text")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <BsTextareaResize size={30} />
          </button>
          <button
            onClick={() => addBlock("bulletPoint")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <FaListUl size={30} />
          </button>
          <button
            onClick={() => addBlock("image")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <BiImageAdd size={30} />
          </button>
          <button
            onClick={() => addBlock("video")}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            <AiOutlineVideoCameraAdd size={25} />
          </button>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
        >
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </div>
    </div>
  );
};

export default BlogUpdatePage;
