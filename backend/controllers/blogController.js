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
    const blogs = await Blog.find({ isApproved: true }) 
      .populate('userId', 'name'); 

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all not approved blogs
const getAllNotApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: false }).populate('userId', 'name');
    //console.log("Fetched blogs:", blogs)
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//approve blog by blogId
const approveBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.isApproved = true;
    await blog.save();

    res.json({ message: 'Blog approved successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//get all blogs by userId
const getAllBlogsByUserId = async(req, res) => {
  try{
    const userId = req.params.userId;
  
    if(!userId) return res.status(400).json({message: "User ID is required"});

    const blogs = await Blog.find({userId}).populate('userId', 'name');
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
  const { title, blocks } = req.body;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update the blog details
    blog.title = title || blog.title;
    blog.blocks = blocks || blog.blocks;

    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating blog" });
  }
};

//delete blog by blogId
const deletBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const user = await Blog.findByIdAndDelete(blogId);

    if (!user) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err); 
    return res.status(500).json({ message: "Internal server error" });
  }
  
};


// like or unlike a blog
const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // If already liked, remove the like (Unlike)
      blog.likes.pull(userId);
    } else {
      // If not liked, add the like
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({ message: alreadyLiked ? "Unliked the blog" : "Liked the blog", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
  createBlog,
  getAllApprovedBlogs,
  getAllNotApprovedBlogs,
  approveBlog,
  getAllBlogsByUserId,
  getBlogByBlogId,
  updateBlog,
  deletBlog,
  likeBlog,
};