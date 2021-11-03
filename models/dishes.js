const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    label: { type: String, default: "" },
    price: { type: Currency, required: true, min: 0 },
    featured: { type: Boolean, default: false },
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
