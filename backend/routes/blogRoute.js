const {createBlog} = require("../controllers/BlogController.js");
const express = require("express");
const blogRoute = express.Router();
const { authenticate } = require("../middleware/verifyToken.js");

blogRoute.post("/create", authenticate, createBlog);

module.exports = blogRoute;
