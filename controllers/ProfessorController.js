const express = require('express');
const router = express.Router();


router.get('/professor', (req, res) => {
    res.json({
        msg: "teste"
    })
})

module.exports = router