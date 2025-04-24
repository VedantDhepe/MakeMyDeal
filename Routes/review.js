const express = require('express');
const router = express.Router({mergeParams : true});
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require('../schema.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviewController = require('../controller/reviews.js');



// Posting a review
router.post(
    '/', 
    isLoggedIn,
      validateReview,
       wrapAsync( reviewController.createReview));  

//Deleting a review id from array of reviews from listing if a review is deleted
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview));

module.exports = router;