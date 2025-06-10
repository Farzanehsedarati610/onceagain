const express = require('express');
const router = express.Router();

router.post('/payout', (req, res) => {
    res.json({ message: "Payout request received!" });
});

module.exports = router;

