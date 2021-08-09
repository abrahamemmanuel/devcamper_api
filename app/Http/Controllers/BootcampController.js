const path = require('path');
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../../../database/models/Bootcamp');
const asyncHandler = require('../Middleware/async');
const geocoder = require('../utils/geocoder');

// @desc Create new Bootcamp
// @route /api/v1/bootcamp/
// @method POST
// @access Private 
exports.createBootcamp = asyncHandler(async(req, res, next) => {
      const bootcamp = await Bootcamp.create(req.body);
      res.status(201).json({
         succes: true,
         data: bootcamp
      });
});


// @desc Get All Bootcamps
// @route /api/v1/bootcamps
// @method GET
// @access Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
     res.status(200).json(res.advancedResults);
});


// @desc Get single Bootcamp
// @route /api/v1/bootcamp/:id
// @method GET
// @access Public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
      const bootcamp = await Bootcamp.findById(req.params.id);
      
      if(!bootcamp){
         return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`));
      }
      res.status(200).json({ success: true, data: bootcamp});
});


// @desc Update single Bootcamp
// @route /api/v1/bootcamp/:id
// @method PUT
// @access Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
      const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
      if(!bootcamp){
         return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`));
      }
      res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete single Bootcamp
// @route /api/v1/bootcamp/:id
// @method DELETE
// @access Private
exports.deleteBootcamp = asyncHandler(async(req, res, next) => {
      const bootcamp = await Bootcamp.findById(req.params.id);
      if(!bootcamp){
         return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
      }

      bootcamp.remove();

      res.status(200).json({ success: true, data: null });
});

// @desc Get Bootcamps by radius
// @route /api/v1/bootcamp/:zipcode/:distance
// @method GET
// @access Private
exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
   const { zipcode, distance } = req.params;

   //Get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   //Calc radius using radians
   //Divide dist by radius of earth
   //Earth Radius = 3,963 mi / 6,378km
   const radius = distance / 3963;

   const bootcamps = await Bootcamp.find({
      location: { $geoWithin: {$centerSphere: [[lng, lat], radius]} }
   });

   res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
   });
});


// @desc Upload photo for bootcamp
// @route /api/v1/bootcamp/:id/photo
// @method PUT 
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
   const bootcamp = await Bootcamp.findById(req.params.id);
   if(!bootcamp){
      return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
   }

   // Check if files was uploaded
   if(!req.files){
      return  next(new ErrorResponse(`Please upload a file`, 400));
   }

   const file = req.files.file;

   // Check if file is an image file
   if(!file.mimetype.startsWith('image')){
      return  next(new ErrorResponse(`Please upload an image file`, 400));
   }

   // Check filesize
   if(file.size > process.env.MAX_FILE_UPLOAD){
      return  next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
   }

   // Create custom filename
   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
   
   // Set file path
   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if(err){
         console.error(err);
         return  next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

      return res.status(200).json({  succes: true, data: file.name })
   })
});