const Blog = require("../models/Blog");

//Create a new blog
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

//get all approved blogs with pagination
const getAllApprovedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const blogs = await Blog.find({ isApproved: true }) 
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('userId', 'username'); 

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all not approved blogs
const getAllNotApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: false }) 
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBlog,
  getAllApprovedBlogs,
  getAllNotApprovedBlogs
};