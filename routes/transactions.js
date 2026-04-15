const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/auth');


router.use(authMiddleware);


router.get('/my', transactionController.getMyTransactions);
router.get('/:id', transactionController.getTransactionById);
router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);

// --- إضافة مسار التحويل (Bonus) ---
router.post('/transfer', transactionController.transfer); 

module.exports = router;