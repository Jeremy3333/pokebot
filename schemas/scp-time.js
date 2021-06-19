const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};
const reqNumbre = {
  type: Number,
  required: true,
};

const scpTimeSchema = mongoose.Schema({
  _id: reqString,
  roll: reqNumbre,
  rollTime: reqNumbre,
  claimTime: reqNumbre,
});

module.exports = mongoose.model("SCP-time", scpTimeSchema);
