const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

// Create Review

module.exports.createReview = async (req,res) =>{
    let listing = await Listing.findById(req.params.id );
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "The review is successfully Added");
    res.redirect(`/listing/${listing._id}`);
};

// Delete Review

module.exports.destroyReview = async (req,res) =>{
    let {id, reviewId} = req.params; 
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "The review is successfully Deleted");
    res.redirect(`/listing/${id}`);
};