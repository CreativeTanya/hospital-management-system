const express = require("express");
const Prescription = require("../models/Prescription");

const router = express.Router();

// GET all prescriptions
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({
      createdAt: -1,
    });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prescriptions",
      error: error.message,
    });
  }
});

// GET one prescription
router.get("/:id", async (req, res) => {
  try {
    const prescription =
      await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prescription",
      error: error.message,
    });
  }
});

// CREATE prescription
router.post("/", async (req, res) => {
  try {
    const prescription = await Prescription.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      medicine: req.body.medicine,
      dosage: req.body.dosage,
      duration: req.body.duration,
      instructions: req.body.instructions,
      status: req.body.status || "Active",
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create prescription",
      error: error.message,
    });
  }
});

// UPDATE prescription
router.put("/:id", async (req, res) => {
  try {
    const prescription =
      await Prescription.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json(prescription);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update prescription",
      error: error.message,
    });
  }
});

// DELETE prescription
router.delete("/:id", async (req, res) => {
  try {
    const prescription =
      await Prescription.findByIdAndDelete(
        req.params.id
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.json({
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete prescription",
      error: error.message,
    });
  }
});

module.exports = router;