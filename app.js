if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
const express = require('express');
const app = express();
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js') 
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError.js")
const path = require('path');
const {listingSchema, reviewSchema} = require('./schema.js');
const Review = require('./models/review.js');
 
const listingRouter = require('./Routes/listing.js');
const reviewRouter = require('./Routes/review.js');
const userRouter = require('./Routes/user.js');

const session = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.use(flash());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine" , "ejs");  
app.set("views", path.join(__dirname, "views")); 
app.engine('ejs', ejsMate);


const port = 8080;


// const mongo_URL = 'mongodb://127.0.0.1:27017/MakeMyDeal';
const db_URL = process.env.ATLASDB_URL;
main().then((req,res) => {console.log("Connected to DataBase Successfully")}).catch((err) => {console.log("Error in connecting to DataBase" + err)});
async function main() {
    await mongoose.connect(db_URL); 
} 

const store = MongoStore.create({
    mongoUrl : db_URL,
    crypto : {
        secret : process.env.SESSION_SECRET,
    },
    touchAfter : 24 * 60 * 60, // 24 Hours.
})

const sessionOption = {
    store,  
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 1000 * 60 * 60 * 24,
        maxAge : 7 * 1000 * 60 * 60 * 24,
        httpOnly : true,
    }
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// This middleware for flash shold be use before all routes since all the routes should be accessible for the flash messages
//Also this requires sessions to be created already...
//Response.locals
app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
 })




app.get("/demouser", async (req,res) =>{
    let fakeUser = new User({
        email : "vedant@gmail.com",
        username : "Vedant Ujwala Hanumant Dhepe"
    });

    let registeredUser = await User.register(fakeUser, "This is password");
    res.send(registeredUser);
});

// app.get("/login", (req,res) =>{
//     res.render("login.ejs");
// })

app.use('/listing', listingRouter);
app.use('/listing/:id/review', reviewRouter);
app.use('/user', userRouter)
 

app.get('/testListing',wrapAsync(async (req,res) => {
    let listing1 = new Listing({
        disctiption : "This is a test listing1",
        title : "Test Listing1",
        price : 1000,
        location : "Test Location1",
        country : "Test Country1"
    });
    await listing1.save().then((res)=>console.log("Successfully saved the listing1")).catch((err) => console.log("Error in saving the listing1"));
    res.send("Listing saved");
}));

app.get('/', (req,res) => { 
    res.send("This is  root page");
})
app.all("*", (req,res, next) =>{
    next(new ExpressError(404, "Page not Found!"));
});  

app.use((err,req,res,next)=>{ // What will happen if we remove next  from this 
    let { message = "Some Error Occured"} = err;
    let {status = 400} = err;
    // res.status(status).send(message);
     res.status(status).render('error.ejs', {status, message});
});



app.listen(port, () =>{ 
    console.log("Server is running on port " + port);
});  
