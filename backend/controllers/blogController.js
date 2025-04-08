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

//get all blogs by userId
const getAllBlogsByUserId = async(req, res) => {
  try{
    const userId = req.params.userId;
  
    if(!userId) return res.status(400).json({message: "User ID is required"});

    const blogs = await Blog.find({userId});
    res.json(blogs);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

//get blog by blogId
const getBlogByBlogId = async(req, res) => {
  try{
    const blogId = req.params.blogId;
  
    if(!blogId) return res.status(400).json({message: "Blog ID is required"});
    
    const blogs = await Blog.findById(blogId);

    if(!blogs) return res.status(404).json({message: "Blog not found"});

    res.json(blogs);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

//update blog by blogId
const updateBlog = async (req, res) => {
  try {
    const  blogId = req.params.blogId;
    if (!blogId) return res.status(400).json({ message: "Blog ID is required" });
    const { title, blocks } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, blocks },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBlog,
  getAllApprovedBlogs,
  getAllNotApprovedBlogs,
  getAllBlogsByUserId,
  getBlogByBlogId,
  updateBlog
};