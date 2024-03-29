const express = require("express");
const bodyParser = require("body-parser");
const { verifyUser, verifyAdmin } = require("../authenticate");

const Dishes = require("../models/dishes");
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")

  .get((req, res, next) => {
    Dishes.find()
      .populate("comments.author")
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })

  .delete(verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.remove({})
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

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })

  .put(verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete(verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
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

//---------- For Comments of dishes -----------

dishRouter
  .route("/:dishId/comments")

  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            const err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            const comments = JSON.parse(JSON.stringify(dish.comments));
            req.body.author = req.user._id;
            comments.push(req.body);
            dish.comments = comments;
            dish.save().then(
              (dish) => {
                Dishes.findById(dish._id)
                  .populate("comments.author")
                  .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments);
                  });
              },
              (err) => next(err)
            );
          } else {
            const err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  })

  .delete(verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comments = [];
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            const err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            const err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            const err = new Error(
              "Comment " + req.params.commentId + " not found"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments/" +
        req.params.commentId
    );
  })

  .put(verifyUser, async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);

      if (dish && dish.comments.id(req.params.commentId)) {
        const find = dish.comments.find(
          ({ _id, author }) =>
            _id == req.params.commentId && `${author}` == req.user._id
        );
        if (!find) {
          res.statusCode = 403;
          return res.end("You are not allowed to modify this comment");
        }
        if (req.body.rating)
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        if (req.body.comment)
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        await dish.save();

        const updatedDish = await Dishes.findById(dish._id).populate(
          "comments.author"
        );

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(updatedDish.comments.id(req.params.commentId));
      } else if (dish == null) {
        const err = new Error("Dish " + req.params.dishId + " not found");
        err.status = 404;
        return next(err);
      } else {
        const err = new Error("Comment " + req.params.commentId + " not found");
        err.status = 404;
        return next(err);
      }
    } catch (err) {
      return next(err);
    }
  })

  .delete(verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId)) {
            const find = dish.comments.find(
              ({ _id, author }) =>
                _id == req.params.commentId && `${author}` == req.user._id
            );
            if (!find) {
              res.statusCode = 403;
              return res.end("You are not allowed to modify this comment");
            }

            dish.comments.id(req.params.commentId).remove();
            /*
            dish.comments = dish.comments.filter(
              (comment) => comment._id != req.params.commentId
            );*/
            dish.save().then(
              (dish) => {
                Dishes.findById(dish._id)
                  .populate("comments.author")
                  .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish.comments.id(req.params.commentId));
                  });
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            const err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            const err = new Error(
              "Comment " + req.params.commentId + " not found"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
