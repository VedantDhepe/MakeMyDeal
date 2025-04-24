const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })



router.route("/")



    // get all listings
    .get(
        wrapAsync(listingController.index)
    )

    //Create Listing
    .post( 
        isLoggedIn,  
        upload.single('formData[image]'),
        validateListing,
        wrapAsync( listingController.createListing)
    );



router.route('/new')

    // Render newListing Form
    .get( 
        isLoggedIn, 
        listingController.renderNewForm
    );


 
router.route("/:id")
    //Update Route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('formData[image]'),
        validateListing,
        listingController.updateListing
    )

    //Show Route
    .get(
        wrapAsync( listingController.showListing)
    )

    //Delete Route
    .delete(
        isLoggedIn, isOwner, 
        wrapAsync( listingController.destroyListing )
    )



router.route("/:id/edit")
    //Edit Route
    .get(
        isLoggedIn, 
        isOwner,  
        wrapAsync( listingController.renderEditForm)
    )



module.exports = router;