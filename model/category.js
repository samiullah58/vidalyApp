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
});

categorySchema.add({
  children: [categorySchema], // Embed the child categories within the parent category
});

const Category = mongoose.model("Category", categorySchema);

// the actual validation for user input
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

// GPT

// const categorySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 255,
//   },
//   shortTitle: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 50,
//   },
//   description: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 2000,
//   },
//   parent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     default: null,
//   },
//   children: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//     },
//   ],
// });

// categorySchema.virtual("subcategories", {
//   ref: "Category",
//   localField: "_id",
//   foreignField: "parent",
//   justOne: false,
// });

// categorySchema.set("toObject", { virtuals: true });
// categorySchema.set("toJSON", { virtuals: true });

// const Category = mongoose.model("Category", categorySchema);

// function validateCategory(category) {
//   const schema = Joi.object({
//     title: Joi.string().min(2).max(255).required(),
//     shortTitle: Joi.string().min(2).max(50).required(),
//     description: Joi.string().min(2).max(2000).required(),
//   });

//   return schema.validate(category);
// }

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
