const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.set("view engine" , "ejs");  
app.set("views", path.join(__dirname, "views")); 

app.use(cookieParser("secretCode"));
const sessionOption = {
    secret : "thisIsMySecret",
    resave : false,
    saveUninitialized : true,
};
app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next(); 
})


// app.get("/clickCount", (req,res) =>{

//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//          req.session.count = 1;
//     }
//     res.send(`The number of click is ${req.session.count}`);
// });

app.get('/register', (req,res)=>{
    let {name = "User"} = req.query;
    req.session.name = name;
    if(name === "User"){
        req.flash("error", `${name} is not valid`);
    }
    else{
        req.flash("success", `${name} is registered Successfully`);
    }
     res.redirect('/greet');
    
});
app.get('/greet', (req, res) =>{
    // res.send(req.session.name);
    res.render("page.ejs", {name : req.session.name});
});

app.get("/", (req,res) =>{
    res.send("This is root");
});
app.get("/addCookie", (req,res)=>{
    res.cookie("name", "Express");
    res.cookie('location', "Buldhana", {signed : true});
    res.send("This is AddCookie");
})
app.get("/getCookie", (req,res)=>{
    let {name} = req.cookies;
    res.send(name);
})
app.get("/signedCookie", (req,res) =>{
    console.log(req.cookies);
    res.send('SignedCookies');

});


app.listen(8080, () => {
    console.log("Server started at port 8080");
})