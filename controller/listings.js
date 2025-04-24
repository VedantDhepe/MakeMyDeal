const Listing = require('../models/listing');

// All Listings 
module.exports.index =  async (req,res) =>{
    let allListings = await Listing.find({});
    res.render('index.ejs', {allListings});
};
module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs");
}

//Show Route

module.exports.showListing = async  (req,res)=>{ 
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
         populate :{ path : "author"}       
        })
        .populate("owner");
      // This is method chaining. we use populate on 2 different fields.
    if(!listing){
        req.flash("error", "The Listing you requested for does not exist");
        return res.redirect('/listing');    }
    res.render("show.ejs", {listing});
};

// DeleteRoute

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deletedData = await Listing.findByIdAndDelete(id);
    req.flash("success", "The listing is successfully Deleted");
    console.log(deletedData);
    res.redirect('/listing');

};

// Create Route
module.exports.createListing = async(req,res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const formData = req.body.formData;
    let newListing = new Listing(formData);

    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "The listing is successfully Added");
    res.redirect('/listing'); 
 
};

//Edit Route
module.exports.renderEditForm = async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The Listing you requested for does not exist");
        return res.redirect('/listing');
    }
    let imgUrl = listing.image.url;
    imgUrl = imgUrl.replace("/upload", "/upload/e_blur:500/h_100,w_200");
    res.render('edit.ejs', {listing,imgUrl});
};

//Update Route
module.exports.updateListing = async (req,res) =>{    
    let {id} = req.params;
    let updatedData = await Listing.findByIdAndUpdate(id, {...req.body.formData}, {runValidators : true, new : true});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedData.image = {url, filename};
        await updatedData.save();
    }
    
    req.flash("success", "The listing is successfully Updated");
    res.redirect('/listing');
};
