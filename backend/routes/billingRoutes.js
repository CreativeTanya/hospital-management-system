const express = require("express");
const Billing = require("../models/Billing");

const router = express.Router();

// GET all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Billing.find().sort({
      createdAt: -1,
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch billing records",
      error: error.message,
    });
  }
});

// GET one bill
router.get("/:id", async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        message: "Billing record not found",
      });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch billing record",
      error: error.message,
    });
  }
});

// CREATE bill
router.post("/", async (req, res) => {
  try {
    console.log("Bill data received:", req.body);

    const bill = await Billing.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      service: req.body.service,
      amount: req.body.amount,
      date: req.body.date,
      payment: req.body.payment || "Pending",
    });

    console.log("Bill created:", bill);

    res.status(201).json(bill);
  } catch (error) {
    console.error("CREATE BILL ERROR:", error);

    res.status(400).json({
      message: "Failed to create bill",
      error: error.message,
    });
  }
});

// UPDATE bill
router.put("/:id", async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bill) {
      return res.status(404).json({
        message: "Billing record not found",
      });
    }

    res.json(bill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update bill",
      error: error.message,
    });
  }
});

// DELETE bill
router.delete("/:id", async (req, res) => {
  try {
    const bill = await Billing.findByIdAndDelete(
      req.params.id
    );

    if (!bill) {
      return res.status(404).json({
        message: "Billing record not found",
      });
    }

    res.json({
      message: "Bill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete bill",
      error: error.message,
    });
  }
});

module.exports = router;