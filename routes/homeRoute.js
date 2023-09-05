const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await res.render('home');
});

module.exports = router;
