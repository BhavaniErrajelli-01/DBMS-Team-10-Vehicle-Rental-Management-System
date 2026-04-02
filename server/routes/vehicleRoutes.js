const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Remove "admin" middleware so ANY logged-in user can add a vehicle
router.post('/', protect, upload.single('image'), (req, res, next) => {
  console.log("HIT POST /api/vehicles - NEW CODE WITHOUT ADMIN");
  next();
}, vehicleController.addVehicle);

router.post('/delete-match', protect, vehicleController.deleteVehicleByMatch);

router.put('/:id', protect, admin, vehicleController.updateVehicle);
router.delete('/:id', protect, vehicleController.deleteVehicle);

module.exports = router;
