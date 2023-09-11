const express = require("express");
const bodyParser = require("body-parser");
const { verifyUser } = require("../authenticate");

const Promotions = require("../models/promotions");
const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")

  .get((req, res, next) => {
    Promotions.find()
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })

  .delete(verifyUser, (req, res, next) => {
    Promotions.remove({})
      .then(
        (result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(result);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promotionId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promotionId
    );
  })

  .put(verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promotionId,
      { $set: req.body },
      { new: true }
    )
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete(verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionId).then((result) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    });
  });

module.exports = promotionRouter;
