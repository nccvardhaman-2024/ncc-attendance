const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true
    },
    regimentalNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    cadetName: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    recordedBy: {
      type: String,
      required: true
    },
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ regimentalNumber: 1, date: 1 }, { unique: true });

attendanceSchema.set('toJSON', {
  transform(doc, ret) {
    ret.recordedAt = ret.recordedAt instanceof Date ? ret.recordedAt.toISOString() : ret.recordedAt;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
