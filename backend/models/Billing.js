const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: String,
      required: true,
      trim: true,
    },

    doctor: {
      type: String,
      required: true,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: String,
      required: true,
    },

    payment: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Billing", billingSchema);