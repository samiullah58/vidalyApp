// const { Category, validate } = require("../model/category");
// const express = require("express");
// const router = express.Router();
// router.use(express.json());

// router.get("/", async (req, res) => {
//   const categories = await Category.find();
//   res.send(categories);
// });

// router.post("/", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const { title, shortTitle, description, parent } = req.body;

//   // Check if the parent ID exists and is valid
//   if (parent) {
//     const parentCategory = await Category.findById(parent);
//     if (!parentCategory) {
//       return res.status(400).send("Invalid parent category ID");
//     }
//   }

//   let category = new Category({
//     title: title,
//     shortTitle: shortTitle,
//     description: description,
//     parent: parent,
//   });

//   category = await category.save();

//   // Update the parent category's children
//   if (parent) {
//     const parentCategory = await Category.findByIdAndUpdate(
//       parent,
//       { $addToSet: { children: category._id } },
//       { new: true }
//     );
//   }

//   res.send(category);
// });

// router.put("/:parentId/children", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const { title, shortTitle, description } = req.body;
//   const parentId = req.params.parentId;

//   // Check if the parent ID exists and is valid
//   const parentCategory = await Category.findById(parentId);
//   if (!parentCategory) {
//     return res.status(400).send("Invalid parent category ID");
//   }

//   const childCategory = {
//     title: title,
//     shortTitle: shortTitle,
//     description: description,
//     children: [], // Set an empty array for the child category's children
//   };

//   // Add the child category to the parent category's children array
//   parentCategory.children.push(childCategory);
//   await parentCategory.save();

//   res.send(childCategory);
// });

// router.delete("/:id", async (req, res) => {
//   const category = await Category.findByIdAndDelete(req.params.id);
//   if (!category) res.status(404).send("Category Not Found");
//   res.send(category);
// });

// router.get("/:id", async (req, res) => {
//   const category = await Category.findById(req.params.id);
//   if (!category) res.status(404).send("Category Not Found");
//   res.send(category);
// });

// module.exports = router;

// practicing

const { Category, validate } = require("../model/category");
const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, shortTitle, description, parent } = req.body;

  // Check if the parent ID exists and is valid
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return res.status(400).send("Invalid parent category ID");
    }
  }

  let category = new Category({
    title: title,
    shortTitle: shortTitle,
    description: description,
    parent: parent,
  });

  category = await category.save();

  // Update the parent category's children
  if (parent) {
    const parentCategory = await Category.findByIdAndUpdate(
      parent,
      { $addToSet: { children: category._id } },
      { new: true }
    );
    return parentCategory;
  }

  res.send(category);
});

router.put("/:parentId/children", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, shortTitle, description } = req.body;
  const parentId = req.params.parentId;

  // Check if the parent ID exists and is valid
  const parentCategory = await Category.findById(parentId);
  if (!parentCategory) {
    return res.status(400).send("Invalid parent category ID");
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

// last one from GPT

// router.put("/:parentId/children", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const { title, shortTitle, description } = req.body;
//   const parentId = req.params.parentId;
//   const childId = req.params.childId;

//   // Check if the parent ID exists and is valid
//   const parentCategory = await Category.findById(parentId).populate(
//     "subcategories"
//   );
//   if (!parentCategory) {
//     return res.status(400).send("Invalid parent category ID");
//   }

//   // Find the child category within the parent category
//   let childCategory = parentCategory.subcategories.find(
//     (child) => child._id.toString() === childId
//   );

//   if (!childCategory) {
//     return res.status(400).send("Invalid child category ID");
//   }

//   if (!childCategory.children) {
//     childCategory.children = []; // Initialize children array if it doesn't exist
//   }

//   const subChildCategory = new Category({
//     title: title,
//     shortTitle: shortTitle,
//     description: description,
//     parent: childId, // Set the parent of the subchild category to the child category ID
//   });

//   const savedSubChildCategory = await subChildCategory.save();

//   // Add the subchild category to the appropriate child category's children array
//   childCategory.children.push(savedSubChildCategory._id);
//   await parentCategory.save();

//   // Find the updated child category to return in the response
//   childCategory = parentCategory.subcategories.find(
//     (child) => child._id.toString() === childId
//   );

//   res.send(childCategory);
// });

router.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) res.status(404).send("Category Not Found");
  res.send(category);
});

module.exports = router;
