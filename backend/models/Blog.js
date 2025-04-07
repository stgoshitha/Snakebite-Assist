import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum : ["text", "image", "video"],
    required: true,
  },
  content:{
    type: String,
    required: true,
  }
});

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  blocks: [BlockSchema],
  like:[{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
  isApproved: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Blog = mongoose.model("blog", BlogSchema);
model.exports = Blog;