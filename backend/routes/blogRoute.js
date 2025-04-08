const {createBlog,getAllApprovedBlogs,getAllNotApprovedBlogs,getAllBlogsByUserId,getBlogByBlogId,updateBlog} = require("../controllers/BlogController.js");
const express = require("express");
const blogRoute = express.Router();
const { authenticate, isAdminOrSuperAdmin } = require("../middleware/verifyToken.js");

blogRoute.post("/create", authenticate, createBlog);
blogRoute.get("/getAllApprovedBlogs", getAllApprovedBlogs);
blogRoute.get("/getAllNotApprovedBlogs", isAdminOrSuperAdmin, getAllNotApprovedBlogs);
blogRoute.get("/getAllBlogByUserId/:userId", authenticate, getAllBlogsByUserId);
blogRoute.get("/getBlogByBlogId/:blogId", authenticate, getBlogByBlogId);
blogRoute.patch("/updateBlog/:blogId", authenticate, updateBlog);


module.exports = blogRoute;
