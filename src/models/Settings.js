
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  initialBalance: {
    type: Number,
    required: true,
    default: 0
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  lastBackupDate: {
    type: Date
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
