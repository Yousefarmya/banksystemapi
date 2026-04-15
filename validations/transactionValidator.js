exports.validateAmount = (req, res, next) => {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. Must be a positive number." });
    }
    next();
};