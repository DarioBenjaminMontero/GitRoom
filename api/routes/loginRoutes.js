const { Router } = require("express");
const {  login } = require("../controllers/loginController.js");

const router = Router();

router.post('/login', login);

module.exports = router;