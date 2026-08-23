const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Reviewed"],
      default: "Pending",
    },
    doctor: {
  type: String,
  trim: true,
  default: "Not Assigned",
},

reportType: {
  type: String,
  trim: true,
  default: "Blood Test",
},

date: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model(
  "AIReport",
  aiReportSchema
);