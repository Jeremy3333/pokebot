const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const scpSchema = mongoose.Schema({
  _id: reqString,
  scp: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("SCP", scpSchema);
