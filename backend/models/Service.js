const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    serviceType: {
      type: String,
      enum: [
        "Sunday Worship",
        "Sunday Evening",
        "Bible Study",
        "Prayer Meeting",
        "Youth Service",
        "Children Service",
        "Special Service",
        "Convention",
        "Funeral",
        "Wedding",
        "Other",
      ],
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    attendanceCode: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Only one active service at a time
serviceSchema.index(
  {
    active: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      active: true,
    },
  }
);

module.exports = mongoose.model("Service", serviceSchema);