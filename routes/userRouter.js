const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/users");
const passport = require("passport");
const { use } = require("express/lib/router");
const { getToken, verifyUser, verifyAdmin } = require("../authenticate");

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get("/", verifyUser, verifyAdmin, (req, res) => {
  User.find({}).then((users) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(users);
  });
});

router.post("/register", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json(err);
      } else {
        const { firstName, lastName } = req.body;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        user.save().then(() => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            return res.json(err);
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration successful" });
          });
        });
      }
    }
  );
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, token, status: "Login successful" });
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-di");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
