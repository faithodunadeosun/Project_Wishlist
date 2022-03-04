
const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/usercontroller');
const upload = require('../middleware/authorise');
const auth = require('../middleware/authorise')
// get home page
router.get('/',  (req, res) => {
    res.send('Hello World');
})


router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/get', auth, userCtrl.get);
router.post('/request_reset', userCtrl.request_password_reset);
router.post('/reset_password', userCtrl.reset_password);
module.exports = router;