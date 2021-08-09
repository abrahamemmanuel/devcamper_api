const express = require('express');
const { 
        getBootcamps, 
        getBootcamp, 
        createBootcamp, 
        updateBootcamp, 
        deleteBootcamp,
        bootcampPhotoUpload,
      getBootcampsInRadius} = require('../app/Http/Controllers/BootcampController')

const advancedResults = require('../app/Http/Middleware/advancedResults');
const Bootcamp = require('../database/models/Bootcamp');
//Include other resource routers
const courseRouter = require('./courses');


const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
 
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router; 