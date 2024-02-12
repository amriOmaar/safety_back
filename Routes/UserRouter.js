const express = require('express')
const { loginUser, registerUser, getUsers, updateToken, getDetailsUser } = require('../Controllers/UserController.js')

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", getUsers);
router.get("/get/:userId/details", getDetailsUser);
router.post("/token", updateToken);


module.exports = router