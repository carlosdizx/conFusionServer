const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

router.post("/singup", function (req, res, next) {
  User.findOne({ username: req.body.user })
    .then((user) => {
      if (user) {
        const error = new Error(
          "User " + req.body.username + " already exists!"
        );
        error.status = 403;
        next(error);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "success", user: user });
      },
      (err) => {
        next(err);
      }
    )
    .catch((err) => next(err));
});

module.exports = router;
