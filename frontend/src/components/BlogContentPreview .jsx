import React from "react";
import { TbPointFilled } from "react-icons/tb";

const BlogContentPreview = ({ blogDetail }) => {
  if (!blogDetail) return <p>Loading...</p>;

  return (
    <div className="p-4 rounded-lg shadow mb-4 bg-white">
      <h2 className="text-2xl font-semibold mb-4">{blogDetail.title}</h2>

      {blogDetail.blocks?.map((block, index) => (
        <div key={index} className="mb-4">
          {block.type === "heading1" && (
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="text-3xl font-bold"
            />
          )}
          {block.type === "heading2" && (
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="text-2xl font-bold"
            />
          )}
          {block.type === "heading3" && (
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="text-xl font-bold"
            />
          )}
          {block.type === "text" && (
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="text-lg text-justify leading-7"
            />
          )}
          {block.type === "bulletPoint" && (
            <div className="flex items-start gap-2">
              <TbPointFilled size={20} className="mt-1 text-gray-700" />
              <p className="text-lg leading-7">{block.content}</p>
            </div>
          )}
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
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x200?text=Image+Not+Found";
                  }}
                  className="max-h-[400px] object-contain rounded shadow-lg"
                />
              </div>
            </div>
          )}
          {block.type === "video" && (
            <div className="relative mb-2 rounded overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
                style={{ backgroundImage: `url(${block.content})` }}
              ></div>
              <div className="relative z-10 flex justify-center p-2">
                <video controls className="max-h-[500px] w-full max-w-lg">
                  <source src={block.content} type="video/mp4" />
                </video>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogContentPreview;
