const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const AIReport = require("../models/AIReport");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "AI Report route is working",
  });
});

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await AIReport.find().sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch AI reports",
      error: error.message,
    });
  }
});
// DELETE report
router.delete("/:id", async (req, res) => {
  try {
    const report = await AIReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "AI report not found",
      });
    }

    res.json({
      message: "AI report deleted successfully",
    });
  } catch (error) {
    console.error("Delete AI report error:", error);

    res.status(500).json({
      message: "Failed to delete AI report",
      error: error.message,
    });
  }
});
// Analyze uploaded report
router.post(
  "/analyze",
  upload.single("report"),
  async (req, res) => {
    try {
     if (!req.file) {
  const report = await AIReport.create({
    patient: req.body.patient || "Unknown Patient",
    doctor: req.body.doctor || "Not Assigned",
    reportType: req.body.reportType || "Blood Test",
    date:
      req.body.date ||
      new Date().toISOString().split("T")[0],
    fileName:
      req.body.fileName || "Manual Report",
    extractedText:
      req.body.extractedText ||
      "Medical report added manually.",
    status: req.body.status || "Pending",
  });

  return res.status(201).json({
    message: "Medical report added successfully.",
    report,
  });
}

      let extractedText = "";

      if (req.file.mimetype === "application/pdf") {
        const parser = new PDFParse({
          data: req.file.buffer,
        });

        const result = await parser.getText();

        extractedText = result.text;

        await parser.destroy();
      } else if (req.file.mimetype === "text/plain") {
        extractedText =
          req.file.buffer.toString("utf-8");
      } else {
        return res.status(400).json({
          message:
            "Currently, only PDF and TXT medical reports are supported.",
        });
      }

      if (!extractedText.trim()) {
        return res.status(400).json({
          message:
            "Could not extract readable text from this report.",
        });
      }

      // Patient name will come from the frontend
     let patient = req.body.patient || "";

const patientMatch = extractedText.match(
  /(?:Mr\.|Mrs\.|Ms\.)\s+([A-Za-z ]+?)\s+Age\s*\/\s*Sex/i
);

if (!patient && patientMatch) {
  patient = patientMatch[1].trim();
}

if (!patient) {
  patient = "Unknown Patient";
}

      // Save report in MongoDB
     const report = await AIReport.create({
  patient,
  doctor: req.body.doctor || "Not Assigned",
  reportType: req.body.reportType || "Blood Test",
  date: req.body.date || new Date().toISOString().split("T")[0],
  fileName: req.file.originalname,
  extractedText: extractedText.trim(),
  status: "Pending",
});
      res.status(201).json({
        message:
          "Report uploaded and saved successfully.",
        report,
      });
    } catch (error) {
      console.error(
        "AI report processing error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to process medical report.",
        error: error.message,
      });
    }
  }
);
router.put("/:id", async (req, res) => {
  try {
    const report = await AIReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update report error:", error);

    res.status(500).json({
      message: "Failed to update report",
      error: error.message,
    });
  }
});
module.exports = router;