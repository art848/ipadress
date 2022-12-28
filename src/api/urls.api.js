const express = require("express")

const { point } = require('../controllers/urls.controller');
const router = express.Router();


router.get('/urls/point', point)


module.exports = router;