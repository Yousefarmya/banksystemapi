require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const BankAccount = require('./models/BankAccount');

const seedData = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
   
    await User.deleteMany({});
    await BankAccount.deleteMany({});

    const user = await User.create({
        fullName: "Test Admin",
        email: "admin@bank.com",
        password: "password123",
        role: "admin"
    });

    await BankAccount.create({
        userId: user._id,
        accountNumber: "EG123456789",
        balance: 5000,
        status: "active"
    });

    console.log("Seed data created successfully!");
    process.exit();
};

seedData();