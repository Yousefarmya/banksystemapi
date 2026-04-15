const BankAccount = require('../models/BankAccount');
const Transaction = require('../models/Transaction');

exports.deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ error: "Amount must be greater than 0" });

        const account = await BankAccount.findOne({ userId: req.user.id });
        if (!account) return res.status(404).json({ error: "Account not found" });
        if (account.status !== 'active') return res.status(403).json({ error: "Account is not active" });

        const balanceBefore = account.balance;
        account.balance += amount;
        await account.save();

        const transaction = await Transaction.create({
            accountId: account._id,
            type: 'deposit',
            amount,
            balanceBefore,
            balanceAfter: account.balance,
            status: 'completed'
        });

        res.status(200).json({ message: "Deposit successful", transaction });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.withdraw = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ error: "Amount must be greater than 0" });

        const account = await BankAccount.findOne({ userId: req.user.id });
        
        // Business Rule: Check status and balance
        if (account.status !== 'active') return res.status(403).json({ error: "Account is not active" });
        if (account.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

        const balanceBefore = account.balance;
        account.balance -= amount;
        await account.save();

        const transaction = await Transaction.create({
            accountId: account._id,
            type: 'withdraw',
            amount,
            balanceBefore,
            balanceAfter: account.balance,
            status: 'completed'
        });

        res.status(200).json({ message: "Withdrawal successful", transaction });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMyTransactions = async (req, res) => {
    try {
        const account = await BankAccount.findOne({ userId: req.user.id });
        if (!account) return res.status(404).json({ error: "الحساب غير موجود" });

       
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

       
        const transactions = await Transaction.find({ accountId: account._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

       
        const total = await Transaction.countDocuments({ accountId: account._id });

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTransactions: total,
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
};


exports.getTransactionById = async (req, res) => {
    try {
        const account = await BankAccount.findOne({ userId: req.user.id });
        
        
        const transaction = await Transaction.findOne({ 
            _id: req.params.id, 
            accountId: account._id 
        });

        if (!transaction) {
            return res.status(404).json({ error: "المعاملة غير موجودة أو لا تملك صلاحية للوصول إليها" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ error: "رقم المعاملة غير صالح" });
    }
};

exports.transfer = async (req, res) => {
    const { recipientAccountNumber, amount } = req.body;

    
    if (amount <= 0) return res.status(400).json({ error: "Amount must be greater than zero" });

    try {
        const senderAccount = await BankAccount.findOne({ userId: req.user.id });
        const recipientAccount = await BankAccount.findOne({ accountNumber: recipientAccountNumber });

       
        if (senderAccount.status !== 'active') return res.status(403).json({ error: "Account is frozen or inactive" });
        if (!recipientAccount) return res.status(404).json({ error: "Recipient account not found" });

      
        if (senderAccount.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

       
        const balanceBeforeSender = senderAccount.balance;
        senderAccount.balance -= amount;
        await senderAccount.save();

        const balanceBeforeRecipient = recipientAccount.balance;
        recipientAccount.balance += amount;
        await recipientAccount.save();

        await Transaction.create({
            accountId: senderAccount._id,
            type: 'transfer',
            amount,
            balanceBefore: balanceBeforeSender,
            balanceAfter: senderAccount.balance,
            recipientAccountNumber
        });

        res.status(200).json({ message: "Transfer successful", newBalance: senderAccount.balance });
    } catch (error) {
        res.status(500).json({ error: "Transfer failed", details: error.message });
    }
};