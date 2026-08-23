const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// GET all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1,
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
});

// GET one appointment
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
});

// CREATE appointment
router.post("/", async (req, res) => {
  try {
    const appointment = await Appointment.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      department: req.body.department,
      date: req.body.date,
      time: req.body.time,
      status: req.body.status || "Pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create appointment",
      error: error.message,
    });
  }
});

// UPDATE appointment
router.put("/:id", async (req, res) => {
  try {
    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update appointment",
      error: error.message,
    });
  }
});

// DELETE appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointment =
      await Appointment.findByIdAndDelete(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
});

module.exports = router;