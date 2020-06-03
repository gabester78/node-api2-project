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

router.post("/:id/comments", (req, res) => {
  //   const id = req.params.id;
  //   const commentData = req.body
  //   db.findById(id)
  //   .then((comments)=> {
  //       if ()
  //   })

  //   db.insertComment(commentData)
  //   .then((comments) => {
  //     if (commentData.text === undefined) {
  //       res.status(201).json(comments);
  //   } else {
  //     res.status(400).json({
  //         errorMessage: "Please provide text for the comment.",
  //       });
  //   }
  // })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json({
  //         error: "There was an error while saving the comment to the database",
  //       });
  //     });
  // });

  //Check to see if the post exists
  db.findById(req.params.id)
    .then((post) => {
      if (post) {
        if (req.body.text) {
          //Prepare the comment object and send to the DB
          db.insertComment({
            text: req.body.text,
            post_id: Number(req.params.id),
          })
            //Return the success code and newly created comment
            .then((cId) => {
              db.findCommentById(cId.id).then((comment) => {
                res.status(201).json(comment);
              });
            });
        }
        //Return error message Bad Request
        else
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
      }
      //Return error message Not Found
      else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    })
    //Return server error message
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.get("/", (req, res) => {
  db.find()
    .then((posts) => {
      if (posts) res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The post with the specified ID does not exist." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findPostComments(id)
    .then((comments) => {
      if (comments) {
        res.status(200).json({ data: comments });
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: { error: "The post could not be removed" },
      });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  if (req.body.title === undefined || req.body.contents === undefined) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  db.update(id, req.body)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    });
});

module.exports = router;
