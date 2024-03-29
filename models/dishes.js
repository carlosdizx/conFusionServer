const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const dishSquema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    comments: [commentSchema],
    image: { type: String, required: true },
    category: { type: String, required: true },
    label: { type: String, default: "" },
    price: { type: Currency, required: true, min: 0 },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Dishes = mongoose.model("Dish", dishSquema);

module.exports = Dishes;
