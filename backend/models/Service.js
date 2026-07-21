const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // ==================================
    // Service Information
    // ==================================

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

    // ==================================
    // Attendance
    // ==================================

    attendanceCode: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    closed: {
      type: Boolean,
      default: false,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    attendanceSummary: {
      totalPresent: {
        type: Number,
        default: 0,
      },

      totalAbsent: {
        type: Number,
        default: 0,
      },

      adultsPresent: {
        type: Number,
        default: 0,
      },

      childrenPresent: {
        type: Number,
        default: 0,
      },

      malePresent: {
        type: Number,
        default: 0,
      },

      femalePresent: {
        type: Number,
        default: 0,
      },

      attendanceRate: {
        type: Number,
        default: 0,
      },
    },

    // ==================================
    // Audit
    // ==================================

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

// ==================================
// Indexes
// ==================================

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

// Fast attendance code lookup
serviceSchema.index({
  attendanceCode: 1,
});

// Fast service history sorting
serviceSchema.index({
  serviceDate: -1,
});

module.exports = mongoose.model("Service", serviceSchema);