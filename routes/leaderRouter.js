const express = require("express");
const bodyParser = require("body-parser");

const Leaders = require("../models/leaders");
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter
  .route("/")

  .get((request, response, next) => {
    Leaders.find()
      .then(
        (leaders) => {
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((request, response, next) => {
    response.end(
      "Will add the leader: " +
        request.body.name +
        " with details: " +
        request.body.description
    );
  })

  .put((request, response, next) => {
    response.statusCode = 403;
    response.end("PUT operation not supported on /leaders");
  })

  .delete((request, response, next) => {
    response.end("Deleting all the leaders!");
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
