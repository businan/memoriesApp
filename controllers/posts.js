const PostMessage = require("../models/postMessage.js");
const mongoose = require("mongoose");
const validatePost = require("../helpers/validation.js");

const postController = {
  getPosts: async (req, res) => {
    try {
      const postMessages = await PostMessage.find();

      res.status(200).json(postMessages);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  createPost: async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const post = req.body;
    const newPost = new PostMessage(post);

    try {
      await newPost.save();

      res.status(201).json(newPost);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  updatePost: async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    const newPost = {...post, _id}

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }
    
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, newPost, {new: true})
    res.status(200).json(updatedPost);

  },
  deletePost: async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }

    const deletedPost = await PostMessage.findByIdAndDelete(_id)
    res.status(200).json(deletedPost);
  },
  likePost: async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }
    const post = await PostMessage.findById(_id);
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {likeCount : post.likeCount + 1}, {new: true})
    res.status(200).json(updatedPost);

  }
}; 

module.exports = postController;
