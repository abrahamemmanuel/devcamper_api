const ErrorResponse = require('../utils/errorResponse')
const Course = require('../../../database/models/Course');
const Bootcamp = require('../../../database/models/Bootcamp');
const asyncHandler = require('../Middleware/async');

// @desc Get courses
// @route GET /api/v1/courses
// @route Get /api/v1/:bootcampId/courses
// @method GET
// @access Public
exports.getCourses = asyncHandler(async(req, res, next) => {
  if(req.params.bootcampId){
    const courses = Course.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      succes: true,
      count: courses.length,
      data: courses
    })
  }else{
    res.status(200).json(res.advancedResults);
  }
});



// @desc Get single course
// @route GET /api/v1/course/:id
// @method GET
// @access Public
exports.getCourse = asyncHandler(async(req, res, next) => {

  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if(!course){
    return  next(new ErrorResponse(`Course not found with id of ${req.params.id}`), 404);
 }

  res.status(200).json({
    success: true,
    data: course
  });
});


// @desc Add courses
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @method POST
// @access Private
exports.addCourse = asyncHandler(async(req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`), 404);
 }

 const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc Update course
// @route PUT /api/v1/courses/:id
// @method PUT
// @access Private
exports.updateCourse = asyncHandler(async(req, res, next) => {
  let course = await Course.findById(req.params.id);

  if(!course){
    return  next(new ErrorResponse(`Resource not found with id of ${req.params.id}`), 404);
 }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});


// @desc Delete course
// @route DELETE /api/v1/courses/:id
// @method DELETE
// @access Private
exports.deleteCourse = asyncHandler(async(req, res, next) => {
  const course = await Course.findById(req.params.id);

  if(!course){
    return  next(new ErrorResponse(`Resource not found with id of ${req.params.id}`), 404);
 }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});