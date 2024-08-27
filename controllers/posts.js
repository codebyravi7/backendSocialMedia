import fs from "fs";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json({ message: "Post Created successfully", post });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
export const editPost = async (req, res) => {
  // console.log("first")
  try {
    const { postId, description, picturePath, olderPicture } = req.body;
    // console.log(postId, description, picturePath);
    if (picturePath && olderPicture) {
      fs.unlink(`./public/assets/${olderPicture}`, (err) => {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("file deleted");
        }
      });
    }
    const newPost = await Post.findByIdAndUpdate(postId, {
      description: description,
      picturePath: picturePath,
    });
    const post = await Post.find();
    res.status(201).json({ message: "Post Updated successfully", post });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getPostbyId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post)
      return res.json({ message: "No such Post found!!", success: false });

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE
export const deletePost = async (req, res) => {
  // console.log("welcome to backend!!")
  try {
    const { id } = req.params;
    const postdetail = await Post.findById(id);
    // console.log(postdetail.picturePath);
    fs.unlink(`./public/assets/${postdetail.picturePath}`, (err) => {
      if (err) {
        console.log("error: ", err);
      } else {
        console.log("file deleted");
      }
    });
    await Post.findByIdAndDelete(id);
    const post = await Post.find();
    res.status(201).json({ message: "Post deleted successfully" ,post});
    // res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
