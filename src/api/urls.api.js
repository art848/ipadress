const express = require("express")

const { test, checker } = require('../controllers/urls.controller');
const router = express.Router();

router.post('/urls/test', test);
router.post('/urls/checker', checker);


module.exports = router;