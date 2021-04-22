const express = require('express');
const { getCourses, getCourse, addCourse } = require('../app/Http/Controllers/CourseController')

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);

module.exports = router;