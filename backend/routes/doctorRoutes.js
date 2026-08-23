const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
});

// GET one doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
});

// CREATE doctor
router.post("/", async (req, res) => {
  try {
    console.log("Doctor data received:", req.body);

    const doctor = await Doctor.create({
      name: req.body.name,
      specialization: req.body.specialization,
      phone: req.body.phone,
      email: req.body.email,
      department: req.body.department,
      experience: req.body.experience,
      status: req.body.status || "Available",
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error("Create doctor error:", error);

    res.status(400).json({
      message: "Failed to create doctor",
      error: error.message,
    });
  }
});

// UPDATE doctor
router.put("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update doctor",
      error: error.message,
    });
  }
});

// DELETE doctor
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete doctor",
      error: error.message,
    });
  }
});

module.exports = router;