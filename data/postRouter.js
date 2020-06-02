const express = require("express");
const router = express.Router();
const db = require("./db");

//post function
router.post("/", (req, res) => {
  if (req.body.title === undefined || req.body.contents === undefined) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  db.insert(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});
