const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/posts.json");

const getData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const saveData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

exports.getPosts = (req, res) => {
  res.json(getData());
};

exports.getPostById = (req, res) => {
  const posts = getData();
  const post = posts.find(p => p.id === req.params.id);
  post ? res.json(post) : res.status(404).json({ message: "Post not found" });
};

exports.createPost = (req, res) => {
  const posts = getData();
  const newPost = { id: Date.now().toString(), ...req.body };
  posts.push(newPost);
  saveData(posts);
  res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
  const posts = getData();
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    saveData(posts);
    res.json(posts[index]);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};

exports.deletePost = (req, res) => {
  let posts = getData();
  posts = posts.filter(p => p.id !== req.params.id);
  saveData(posts);
  res.status(204).end();
};
