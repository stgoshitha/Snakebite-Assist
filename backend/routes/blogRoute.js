const {createBlog,getAllApprovedBlogs,getAllNotApprovedBlogs,approveBlog,getAllBlogsByUserId,getBlogByBlogId,updateBlog,deletBlog,likeBlog} = require("../controllers/blogController.js");
const express = require("express");
const blogRoute = express.Router();
const { authenticate, isAdminOrSuperAdmin } = require("../middleware/verifyToken.js");

blogRoute.post("/create", authenticate, createBlog);
blogRoute.get("/getAllApprovedBlogs", getAllApprovedBlogs);
blogRoute.get("/getAllNotApprovedBlogs", isAdminOrSuperAdmin, getAllNotApprovedBlogs);
blogRoute.patch("/approveBlog/:blogId", isAdminOrSuperAdmin, approveBlog);
blogRoute.get("/getAllBlogByUserId/:userId", authenticate, getAllBlogsByUserId);
blogRoute.get("/getBlogByBlogId/:blogId", isAdminOrSuperAdmin, getBlogByBlogId);
blogRoute.get("/usergetBlogByBlogId/:blogId", authenticate, getBlogByBlogId);
blogRoute.patch("/updateBlog/:blogId", authenticate, updateBlog);
blogRoute.delete("/deletBlog/:blogId", authenticate, deletBlog);
blogRoute.put('/like/:blogId', authenticate, likeBlog);

module.exports = blogRoute;
