const express = require("express");
const cors = require("cors");
const app = express();
const postRoutes = require("./routes/posts.routes.js");

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
