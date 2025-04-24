const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const {saveRedirectUrl} = require("../middleware.js");
const router = express.Router();
const userController = require('../controller/users.js');



router.route('/signup')

    // Render Signup Form
    .get(
        userController.renderSignupForm
    )

    // Create new User(signup)
    .post(
         userController.createUser
    );


router.route('/login')
    // Render Login Form
    .get(
         userController.renderLoginForm
    )

    // Login User
    .post(
    saveRedirectUrl, 
    passport.authenticate(
        'local', 
        {failureRedirect : '/user/login', failureFlash: true}
    ),
    userController.loginUser
    );

router.route("/logout")

    //Logout User
    .get(
    userController.logoutUser
    );

module.exports = router;
