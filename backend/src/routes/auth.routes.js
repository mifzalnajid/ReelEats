const express = require('express');
const authController = require("../controllers/auth.controller")
const jwt = require('jsonwebtoken');

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)


router.get("/check-auth", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ loggedIn: false });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ loggedIn: true });
    } catch (err) {
        res.status(401).json({ loggedIn: false });
    }
});


module.exports = router;