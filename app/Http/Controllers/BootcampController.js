const Bootcamp = require('../../../database/models/Bootcamp')
// @desc Create new Bootcamp
// @route /api/v1/bootcamp/
// @method POST
// @access Private 
exports.createBootcamp = async (req, res, next) => {

   try {
      const bootcamp = await Bootcamp.create(req.body);
      res.status(201).json({
         succes: true,
         data: bootcamp
      });
   } catch (error) {
      res.status(400).json({
         succes: false,
      });
   }
}


// @desc Get Bootcamps
// @route /api/v1/bootcamps
// @method GET
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
     const bootcamps = await Bootcamp.find();

     res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}


// @desc Get single Bootcamp
// @route /api/v1/bootcamp/:id
// @method GET
// @access Public
exports.getBootcamp = async (req, res, next) => {
   try {
      const bootcamp = await Bootcamp.findById(req.params.id);
      
      if(!bootcamp){
         return  res.status(400).json({ success: false });
      }
      res.status(200).json({ success: true, data: bootcamp});
   } catch (error) {
      res.status(400).json({ success: false });
   }
}


// @desc Update single Bootcamp
// @route /api/v1/bootcamp/:id
// @method PUT
// @access Private
exports.updateBootcamp = async (req, res, next) => {
   try {
      const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
      if(!bootcamp){
        return res.status(400).json({ success: false });
      }
      res.status(200).json({ success: true, data: bootcamp });
   } catch (error) {
      res.status(400).json({ success: false });
   }
}

// @desc Delete single Bootcamp
// @route /api/v1/bootcamp/:id
// @method DELETE
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
   try {
      const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
      if(!bootcamp){
         return res.status(400).json({ success: false });
      }

      res.status(200).json({ success: true, data: null });
   } catch (error) {
      res.status(400).json({ success: false });
   }
}