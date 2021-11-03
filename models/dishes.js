const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const dishSquema = new Schema(
  {
    name: { type: "string", required: true, unique: true },
    description: { type: "string", required: true },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Dishes = mongoose.model("Dish", dishSquema);

module.exports = Dishes;
