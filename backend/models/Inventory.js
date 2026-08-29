const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "In Stock",
        "Low Stock",
        "Out of Stock",
      ],
      default: "In Stock",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Inventory",
  inventorySchema
);