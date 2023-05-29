const { Category, validate } = require("../model/category");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const categories = await Category.find().populate("children").exec();
  res.send(categories);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, shortTitle, description, parent } = req.body;

  let parentCategory;

  // Check if the parent ID exists and is valid
  if (parent) {
    parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return res.status(400).send("Invalid parent category ID");
    }
  }

  const category = new Category({
    title: title,
    shortTitle: shortTitle,
    description: description,
    parent: parent,
  });

  // If a parent category exists, add the new category as its child
  if (parentCategory) {
    parentCategory.children.push(category);
    await parentCategory.save();
  }

  await category.save();

  res.send(category);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, shortTitle, description } = req.body;
  const parentId = req.params.id;

  // Check if the parent ID exists and is valid
  const parentCategory = await Category.findById(parentId);
  if (!parentCategory) {
    return res.status(400).send("Invalid parent category ID is");
  }

  const childCategory = {
    title: title,
    shortTitle: shortTitle,
    description: description,
    children: [], // Set an empty array for the child category's children
  };

  // Add the child category to the parent category's children array
  parentCategory.children.push(childCategory);
  await parentCategory.save();

  res.send(childCategory);
});

router.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id).populate("children");
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

module.exports = router;
