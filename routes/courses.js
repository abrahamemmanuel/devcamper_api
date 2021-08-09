const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../app/Http/Controllers/CourseController')
const advancedResults = require('../app/Http/Middleware/advancedResults');
const Course = require('../database/models/Course');
const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Course, {path: 'bootcamp', select: 'name, description'}),getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;