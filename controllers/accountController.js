const BankAccount = require('../models/BankAccount');
const Beneficiary = require('../models/Beneficiary');


exports.getMyAccount = async (req, res) => {
    try {
       
        const account = await BankAccount.findOne({ userId: req.user.id });
        
        if (!account) {
            return res.status(404).json({ error: "لم يتم العثور على حساب بنكي لهذا المستخدم" });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الحساب" });
    }
};
exports.getMyAccount = async (req, res) => {
    console.log("--- Account Fetch Attempt ---");
    console.log("User ID from Token:", req.user.id); // This proves your middleware works!

    try {
        const account = await BankAccount.findOne({ userId: req.user.id });
        
        if (!account) {
            console.log("Result: No account found for this user.");
            return res.status(404).json({ error: "Account not found" });
        }

        console.log("Result: Account details retrieved successfully for:", account.accountNumber);
        res.status(200).json(account);
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.addBeneficiary = async (req, res) => {
    try {
        const { accountNumber, bankName, nickname } = req.body;
        
        const newBeneficiary = await Beneficiary.create({
            ownerUserId: req.user.id, 
            accountNumber,
            bankName,
            nickname
        });

        res.status(201).json({ message: "Beneficiary added successfully", data: newBeneficiary });
    } catch (error) {
        res.status(500).json({ error: "Failed to add beneficiary" });
    }
};


exports.getBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({ ownerUserId: req.user.id });
        res.status(200).json(beneficiaries);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch beneficiaries" });
    }
};