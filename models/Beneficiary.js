const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    nickname: { type: String, required: true }
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);