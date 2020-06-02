// import express - creates the express application
const express = require("express");

//import functions from router
const router = require("./data/postRouter");

//create a server
const server = express();
// middleware - to teach express new tricks
server.use(express.json()); // how to parse JSON from the body

server.get("/", (req, res) => {
  res.json({ query: req.query, params: req.params, headers: req.headers });
});

server.use("/api/posts", router);

const port = 4000;
server.listen(port, () => {
  console.log("\n Server running! \n");
});
