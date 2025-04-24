router.post("/", isLoggedIn,  validateListing, wrapAsync( async(req,res, next) => {

    // if(!req.body.formData){
    //     throw new ExpressError(406, "Enter Valid formData");
    // }
    // if(!req.body.formData.country){
    //    throw new ExpressError(400, "Country is Required")
    // }
    // if((typeof req.body.formData.price !== "number" && isNaN(req.body.formData.price))){
    //     throw new ExpressError(410, `${req.body.formData.price} is not a valid price Man!`);
    // } 
    //***************And So on.. for all req.body content to validate in server side( Difficult Task ) */

    //******Alternative for the comments above == Joi package of npm */

    // const  result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    console.log("HI");
    
    const formData = req.body.formData;
    console.log(formData);
    let newListing = new Listing(formData);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success", "The listing is successfully Added");
    res.redirect('/listing'); 
 
}));