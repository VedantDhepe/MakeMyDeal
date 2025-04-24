const Listing = require('./models/listing');
const Review = require('./models/review.js');
const {listingSchema, reviewSchema} = require("./schema.js")



// Creates redirectUrl variable is sessio if authentication fails( i.e. user needs to login first)
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login First to create a listing");
        return res.redirect("/user/login");  
    }
    next();
}

//Saves the redirectUrl into res.locals because session data is expired once user login
module.exports.saveRedirectUrl = (req, res, next) =>{
    let a = 40;
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


// Authorization Middleware for Owner of the listing
module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let newListing = await Listing.findById(id);
    if(!newListing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing. You cannot make changes in it.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

// Authorization Middleware for Author of the review

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id, reviewId} = req.params; 
    let review = await Review.findById(reviewId).populate('author');
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author of this Review. You cannot make changes in it.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

// Validation Middleware for Server Side validation of listingSchema using joi
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el) => el.message).join(',');
        console.log(errmsg);
        throw new ExpressError(400, errmsg); 
    }
    else{
        next();
    }
}

// Validation Middleware for Server Side validation of review Schema using joi

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){

        let errmsg = error.details.map((el) => el.message).join(',');

        throw new ExpressError(400, error);     
    }
    else{
        next();
    }
}



