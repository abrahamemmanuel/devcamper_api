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
     let query;

     //Copy req.query
     const reqQuery = { ...req.query };

     //Fields to exclude
     const removeFields = ['select', 'sort'];

     //Loop over removeFields and delete them from reqQuery
     removeFields.forEach(param => delete reqQuery[param]);

     //Create query string
     let queryStr = JSON.stringify(reqQuery);

     //Create operators ($gt, $gte, etc)
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
     
     //Finding resource
     query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

     //Select fields
     if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
     }

     //Sort fields
     if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
     } else {
        query = query.sort('-createdAt');
     }

     //Pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 25;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     const total = await Bootcamp.countDocuments();

     query = query.skip(startIndex).limit(limit);
     
     //Executing query
     const bootcamps = await query;

     //Pagination result
     const pagination = {};

     if(endIndex < total){
         pagination.next = {
            page: page + 1,
            limit
         };
     }

     if(startIndex > 0){
      pagination.prev = {
         page: page - 1,
         limit
      };
  }

     res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
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
         return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`));
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