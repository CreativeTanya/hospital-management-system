const express = require("express");
const router = express.Router();

const Medicine = require("../models/Medicine");

// GET all medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({
      createdAt: -1,
    });

    res.json(medicines);
  } catch (error) {
    console.error("Fetch medicines error:", error);

    res.status(500).json({
      message: error.message || "Failed to fetch medicines",
    });
  }
});

// ADD medicine
router.post("/", async (req, res) => {
  try {
    const savedMedicine = await Medicine.create(req.body);

    res.status(201).json(savedMedicine);
  } catch (error) {
    console.error("Add medicine error:", error);

    res.status(400).json({
      message: error.message || "Failed to add medicine",
    });
  }
});

// UPDATE medicine
router.put("/:id", async (req, res) => {
  try {
    const updatedMedicine =
      await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedMedicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.json(updatedMedicine);
  } catch (error) {
    console.error("Update medicine error:", error);

    res.status(400).json({
      message: error.message || "Failed to update medicine",
    });
  }
});

// DELETE medicine
router.delete("/:id", async (req, res) => {
  try {
    const deletedMedicine =
      await Medicine.findByIdAndDelete(req.params.id);

    if (!deletedMedicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Delete medicine error:", error);

    res.status(500).json({
      message: error.message || "Failed to delete medicine",
    });
  }
});

module.exports = router;