const User = require("../models/user");

// Render Signup Form 
module.exports.renderSignupForm = (req, res) => {
    res.render('signup.ejs')
};

//Create User

module.exports.createUser = async (req, res, next) =>{
    try{
        let {username, email, password} = req.body;
    const newUser = new User({username,email,password});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to MakeMyDeal");
       res.redirect('/listing'); 
    });
    }
    catch(err){
        req.flash("error", "Username is already used by someone. Please try something else");
        res.redirect("/user/signup");
    }
};

//Render Login Form 
module.exports.renderLoginForm = (req, res) => {
    res.render('login.ejs');
};

//Login Route
module.exports.loginUser = async (req, res) =>{
    req.flash("success", "Welcome back to MakeMyDeal");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};;

//Logout User 

module.exports.logoutUser = (req,res, next) => {
    req.logout( (err) =>{
        if(err){
          return next(err);
        }
        req.flash("success", "You are logged Out");
        res.redirect("/listing");
    })
};
