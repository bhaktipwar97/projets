const express = require("express"); //.............
const router = express.Router();

// index-users
router.get("/", (req, res) => {
  res.send("get for useers");
});

//show-users
router.get("/:id", (req, res) => {
  res.send("getfor show users id");
});

// post-users
router.post("/", (req, res) => {
  res.send("postr for users");
});

//delete-users
router.delete("/:id", (req, res) => {
  res.send("deleter for users");
});

module.exports = router;
