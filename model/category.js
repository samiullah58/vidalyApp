const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  shortTitle: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    },
  ],
});

categorySchema.methods.appendChild = function (child) {
  this.children.push(child);
};

const Category = mongoose.model("Category", categorySchema);

// The actual validation for user input
function validateCategory(category) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    shortTitle: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(50).required(),
    parent: Joi.string().allow(null),
    children: Joi.array().items(Joi.string()).default([]),
  });
  return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
