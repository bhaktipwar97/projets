const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listgingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //index route
  .get(wrapAsync(listgingController.index))

  //create route
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listings[image]"),
    wrapAsync(listgingController.createListing),
  );

//NEW ROUTE
router.get("/new", isLoggedIn, listgingController.renderNewForm);

router
  .route("/:id")
  //show route
  .get(wrapAsync(listgingController.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listings[image]"),
    validateListing,
    wrapAsync(listgingController.updateListing),
  )
  //delte route
  .delete(isLoggedIn, isOwner, wrapAsync(listgingController.destroyListing));

///  edit round
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listgingController.renderEditForm),
);

module.exports = router;
