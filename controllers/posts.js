const PostMessage = require("../models/postMessage.js");
const mongoose = require("mongoose");
const validatePost = require("../helpers/validationPost.js");

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
    const post = req.body;
    const { error } = validatePost({ ...post, creator: req.userId });
    // console.log(error)
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    
    const newPost = new PostMessage({ ...post, creator: req.userId });

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

    const newPost = { ...post, _id };

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, newPost, {
      new: true,
    });
    res.status(200).json(updatedPost);
  },
  deletePost: async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }

    const deletedPost = await PostMessage.findByIdAndDelete(_id);
    res.status(200).json(deletedPost);
  },
  likePost: async (req, res) => {
    const { id: _id } = req.params;

    if (!req.userId) return res.json({ message: "Unauthenticated." });

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that id");
    }
    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((_id) => _id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((_id) => _id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(200).json(updatedPost);
  },
};

module.exports = postController;
