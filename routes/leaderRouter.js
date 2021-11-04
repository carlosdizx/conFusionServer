const express = require("express");
const bodyParser = require("body-parser");

const Leaders = require("../models/leaders");
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")

  .get((req, res, next) => {
    Leaders.find()
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })

  .delete((req, res, next) => {
    Leaders.remove()
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

leaderRouter
  .route("/:leaderId")
  .get((request, response, next) => {
    response.end(
      "Will send details of the leader: " + request.params.leaderId + " to you!"
    );
  })

  .post((request, response, next) => {
    response.statusCode = 403;
    response.end(
      "POST operation not supported on /leaders/" + request.params.leaderId
    );
  })

  .put((request, response, next) => {
    response.write("Updating the leader: " + request.params.leaderId + "\n");
    response.end(
      "Will update the leader: " +
        request.body.name +
        " with details: " +
        request.body.description
    );
  })

  .delete((request, response, next) => {
    response.end("Deleting leader:" + request.params.leaderId);
  });

module.exports = leaderRouter;
