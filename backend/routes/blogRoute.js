const {createBlog,getAllApprovedBlogs,getAllNotApprovedBlogs} = require("../controllers/BlogController.js");
const express = require("express");
const blogRoute = express.Router();
const { authenticate, isAdminOrSuperAdmin } = require("../middleware/verifyToken.js");

blogRoute.post("/create", authenticate, createBlog);
blogRoute.get("/getAllApprovedBlogs", getAllApprovedBlogs);
blogRoute.get("/getAllNotApprovedBlogs", isAdminOrSuperAdmin, getAllNotApprovedBlogs);

module.exports = blogRoute;
