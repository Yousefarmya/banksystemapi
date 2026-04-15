const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
    console.log("1. Registration request received.");
    console.log("2. Request Body:", req.body);
    
    try {
        const { fullName, email, password } = req.body;

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("3. Error: Email already exists.");
            return res.status(400).json({ error: "Email already registered" });
        }

        console.log("4. Creating user in database...");
        const newUser = await User.create({ fullName, email, password });
        console.log("5. User created successfully. ID:", newUser._id);

        console.log("6. Generating bank account for user...");
        const randomAccNumber = 'EG' + Math.floor(Math.random() * 1000000000);
        
       
        await BankAccount.create({
            userId: newUser._id,
            accountNumber: randomAccNumber,
            balance: 0 
        });
        console.log("7. Bank account linked successfully!");

        res.status(201).json({ message: "User registered and bank account created successfully!" });
    } catch (error) {
        console.log("ERROR DURING REGISTRATION");
        console.log(error); 
        
        res.status(500).json({ 
            error: "Internal Server Error", 
            errorDetails: error.message
        });
    }
};


exports.login = async (req, res) => {
    console.log("Login attempt for email:", req.body.email);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid login credentials" });

   
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid login credentials" });

    
        const userToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            message: "Login successful", 
            token: userToken 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};