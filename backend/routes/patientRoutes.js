const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
});

// GET one patient
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
});

// CREATE patient
router.post("/", async (req, res) => {
  try {
    console.log("Patient data received:", req.body);

    const patient = await Patient.create({
  name: req.body.name,
  age: req.body.age,
  gender: req.body.gender,
  phone: req.body.phone,
  email: req.body.email,
  bloodGroup: req.body.bloodGroup,
  address: req.body.address,
  condition: req.body.condition || "General Medicine",
  status: req.body.status || "Active",
  medicalHistory: req.body.medicalHistory,
});

    res.status(201).json(patient);
  } catch (error) {
    console.error("Create patient error:", error);

    res.status(400).json({
      message: "Failed to create patient",
      error: error.message,
    });
  }
});

// UPDATE patient
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update patient",
      error: error.message,
    });
  }
});

// DELETE patient
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete patient",
      error: error.message,
    });
  }
});

module.exports = router;