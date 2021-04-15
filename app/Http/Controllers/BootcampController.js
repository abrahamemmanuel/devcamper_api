const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../../../database/models/Bootcamp');
const asyncHandler = require('../Middleware/async');

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


// @desc Get Bootcamps
// @route /api/v1/bootcamps
// @method GET
// @access Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
     const bootcamps = await Bootcamp.find();

     res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
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
      const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
      if(!bootcamp){
         return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`));
      }

      res.status(200).json({ success: true, data: null });
});