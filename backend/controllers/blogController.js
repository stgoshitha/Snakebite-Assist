const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  try {
    const { title, blocks } = req.body;
    const userId = req.user.id;

    const newBlog = new Blog({
      userId,
      title,
      blocks,
      isApproved: false,
      like: [],
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBlog
};