const express = require("express");

const Inventory = require("../models/Inventory");

const router = express.Router();

// GET ALL INVENTORY ITEMS

router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find().sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    console.error(
      "Fetch inventory error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
});

// ADD INVENTORY ITEM

router.post("/", async (req, res) => {
  try {
    const item = await Inventory.create({
      name: req.body.name,
      category: req.body.category,
      supplier: req.body.supplier,
      quantity: req.body.quantity,
      unit: req.body.unit,
      price: req.body.price,
      status: req.body.status,
    });

    res.status(201).json({
      message: "Inventory item added successfully",
      item,
    });
  } catch (error) {
    console.error(
      "Add inventory error:",
      error
    );

    res.status(500).json({
      message: "Failed to add inventory item",
      error: error.message,
    });
  }
});
// UPDATE INVENTORY ITEM

router.put("/:id", async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        supplier: req.body.supplier,
        quantity: req.body.quantity,
        unit: req.body.unit,
        price: req.body.price,
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    res.json({
      message: "Inventory item updated successfully",
      item,
    });
  } catch (error) {
    console.error(
      "Update inventory error:",
      error
    );

    res.status(500).json({
      message: "Failed to update inventory item",
      error: error.message,
    });
  }
});

// DELETE INVENTORY ITEM

router.delete("/:id", async (req, res) => {
  try {
    const item =
      await Inventory.findByIdAndDelete(
        req.params.id
      );

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found",
      });
    }

    res.json({
      message:
        "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete inventory error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete inventory item",
      error: error.message,
    });
  }
});

module.exports = router;