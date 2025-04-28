import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { BsTextareaResize } from "react-icons/bs";
import Header from "../components/common/Header";

const BlogCreatePage = () => {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  // Add new block
  const addBlock = (type) => {
    const newBlock = { type, content: "" };
    setBlocks([...blocks, newBlock]);
  };

  // Update block content
  const updateBlockContent = (index, content) => {
    const updated = [...blocks];
    updated[index].content = content;
    setBlocks(updated);
  };

  //Remove block
  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
  };

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/blog/create",
        { title, blocks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Blog created!");
      navigate("/userBlog");
      setTitle("");
      setBlocks([]);
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    }
  };

  return (
    <div>
      <Header/>
      <div className="container mx-auto p-4 max-w-[1000px]">
    <div className="flex items-center justify-center bg-green-500 text-white shadow-sm p-10 rounded mb-4">
          <h2 className="text-9xl font-bold">CREATE BLOG</h2>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {blocks.map((block, index) => (
          <div key={index} className="bg-white shadow-sm p-3 rounded mb-4">
            <div className="flex items-center justify-between mb-2">
              {(block.type === "heading1" ||
                block.type === "heading2" ||
                block.type === "heading3" ||
                block.type === "text" ||
                block.type === "bulletPoint" ||
                block.type === "image" ||
                block.type === "video") && (
                <label className="text-gray-500 mr-2">
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
              )}
              <button
                type="button"
                className="text-red-600"
                onClick={() => removeBlock(index)}
              >
                <IoIosClose size={30} />
              </button>
            </div>

            <div className="relative bg-white">
              {(block.type === "heading1" ||
                block.type === "heading2" ||
                block.type === "heading3" ||
                block.type === "text" ||
                block.type === "bulletPoint") && (
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder={
                    block.type === "heading1"
                      ? "Heading 1"
                      : block.type === "heading2"
                      ? "Heading 2"
                      : block.type === "heading3"
                      ? "Heading 3"
                      : block.type === "text"
                      ? "Text Content"
                      : "Bullet Point"
                  }
                  value={block.content}
                  onChange={(e) => updateBlockContent(index, e.target.value)}
                />
              )}

              {(block.type === "image" || block.type === "video") && (
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder={
                    block.type === "image" ? "Image URL" : "Video URL"
                  }
                  value={block.content}
                  onChange={(e) => updateBlockContent(index, e.target.value)}
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("heading1")}
          >
            <LuHeading1 size={30} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("heading2")}
          >
            <LuHeading2 size={25} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("heading3")}
          >
            <LuHeading3 size={20} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("text")}
          >
            <BsTextareaResize size={30} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("bulletPoint")}
          >
            <FaListUl size={30} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("image")}
          >
            <BiImageAdd size={30} />
          </button>
          <button
            type="button"
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={() => addBlock("video")}
          >
            <AiOutlineVideoCameraAdd size={25} />
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Blog
        </button>
      </form>
    </div>
    </div>
  );
};

export default BlogCreatePage;
