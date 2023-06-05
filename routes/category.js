const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const objectId = require("../middleware/validateObjectId");
const { Category, validate } = require("../model/category");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const categories = await Category.find().populate("children").exec();
  res.send(categories);
});

router.post("/", auth, async (req, res) => {
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

router.put("/:id", [objectId, auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      shortTitle: req.body.shortTitle,
      description: req.body.description,
    },
    {
      new: true,
    }
  );

  if (!category) return res.status(404).send("Category not found.");
  res.send(category);
});

router.delete("/:id", [objectId, admin, auth], async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

router.get("/:id", objectId, async (req, res) => {
  const category = await Category.findById(req.params.id).populate("children");
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

module.exports = router;
