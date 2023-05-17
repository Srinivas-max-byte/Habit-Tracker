const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  LastDoneDate: {
    type: String,
    default: "0",
  },
  completedCount: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  isFav: {
    type: Boolean,
    default: false,
  },
  completedDates: [String],
  days: [String],
});

const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;