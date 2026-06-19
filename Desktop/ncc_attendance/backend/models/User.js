const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    regimentalNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['cadet'],
      default: 'cadet',
      index: true
    },
    rank: {
      type: String,
      enum: ['Cadet', 'Lance Corporal', 'Corporal', 'Sergeant', 'Cadet Under Officer', 'Cadet Senior Under Officer'],
      default: 'Cadet',
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
