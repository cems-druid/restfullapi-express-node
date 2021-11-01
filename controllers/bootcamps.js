
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps =asyncHandler(async (req,res,next) =>{
    
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr);
    query = Bootcamp.find(JSON.parse(queryStr));

    const bootcamps = await query;
    if(!bootcamps){
        return next(new ErrorResponse('There are no bootcamps.', 400));
    }
    res.status(200).json({
        success:true,
        count: bootcamps.length,
        data:bootcamps});
    
}); 

//@desc Get a specific bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp =asyncHandler(async (req,res,next) =>{
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if(!bootcamp){
        return  next(new ErrorResponse(`Bootcam not found (${req.params.id})`, 404));
    }

    res.status(200).json({success:true, data: bootcamp});



}); 

//@desc Create a new bootcamp
//@route POST /api/v1/bootcamps
//@access Private
exports.createBootcamp =asyncHandler(async (req,res,next) =>{


    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success:true, 
        data: bootcamp
        });



}); 

//@desc Update a bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = asyncHandler(async (req,res,next) =>{

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!bootcamp){
        return next(new ErrorResponse('There are no bootcamps.', 400));
    }
    res.status(200).json({success:true, msg:`Update bootcamp ${req.params.id}.`});

}); 


//@desc Delete a specific bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.deleteBootcamp = asyncHandler(async (req,res,next) =>{

   
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse('There are no bootcamps.', 400));
    }
    res.status(200).json({success:true, msg:`Delete bootcamp ${req.params.id}.`});

}); 

//@desc     Get bootcamps within a radius
//@route    GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) =>{
    const {zipcode, distance} = req.params;

    //getting longitude and latitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculation, earth r=6378km (3963 mi)
    const radius = distance/6378
    //mongodb find (geology)
    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data:bootcamps
    });
});