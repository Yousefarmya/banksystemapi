const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/auth');


router.use(authMiddleware);

router.get('/me', accountController.getMyAccount);
router.post('/beneficiaries', accountController.addBeneficiary);
router.get('/beneficiaries', accountController.getBeneficiaries);

module.exports = router;