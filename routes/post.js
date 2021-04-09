const express = require("express");

const postController = require('../controllers/posts.js')

const router = express.Router();

router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.patch("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.patch("/:id/likePost", postController.likePost);

module.exports = router;
