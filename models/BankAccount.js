const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['active', 'frozen', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);