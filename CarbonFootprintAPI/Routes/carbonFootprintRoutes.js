const express = require("express");
const router = express.Router();
const carbonFootprintController = require("../Controllers/CarbonFootprintController");

router.post("/", carbonFootprintController.getCarbonFootprint);

module.exports = router;
