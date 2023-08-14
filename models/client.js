const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  customerName: String,
  loanAmount: Number,
  loanDuration: Number,
  bankFile: String,
  repaymentSchedule: [Number],
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
