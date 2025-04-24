// This is the the schema validation for the fields in the data.
// joi is a npm package that is used to validate the fields in the data.
// It is used to validate the data before it is started to be processed.
//joi schema is not DB schema. It is used for server side validation.

const Joi = require('joi');
 

module.exports.listingSchema = Joi.object({
    formData: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(), // Changed the order to min(0).required()
        image: Joi.string().optional().allow('', null), // Explicitly marked as optional
    }).required() // Ensures the entire formData object is required
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        comment : Joi.string().required(),
    }).required(),
});


//To Do like module.exports.listingSchema = Joi.Object({ .......}); We have to use {} while importing... Don know why???



