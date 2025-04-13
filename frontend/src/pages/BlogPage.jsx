import React, { useEffect, useState } from "react";
import { get } from "../services/ApiEndpoint";
import { TbPointFilled } from "react-icons/tb";

const BlogPage = () => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-4 rounded-lg shadow mb-4">
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
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
