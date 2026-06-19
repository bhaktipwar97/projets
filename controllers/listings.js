const Listing = require("../models/listing");

//index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings }); ///i
};

//new oute
module.exports.renderNewForm = (req, res) => {
  //
  res.render("new.ejs"); //new.ejs
};

// show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params; //jise hi hamare pass id aye ose start karne ke liy likhate hai
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!"); //flash
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing }); //show.ejs
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listings);

  newListing.owner = req.user._id;

  newListing.image = { url, filename };

  // Nominatim API
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listings.location)}`,
    {
      headers: {
        "User-Agent": "wanderlust-app",
        Accept: "application/json",
      },
    },
  );

  const data = await response.json();

  console.log(data);

  if (data.length > 0) {
    newListing.geometry = {
      type: "Point",

      coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
    };
  }

  await newListing.save();

  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};



//edit form route
module.exports.renderEditForm = async (req, res) => {
  //1
  let { id } = req.params; //jise hi hamare pass id aye ose start karne ke liy likhate hai
  const listing = await Listing.findById(id); //3
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!"); //flash
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("edit.ejs", { listing, originalImageUrl }); //4 ya mule form edit this listen vr lick kevr tya title sagli info   form mhde apop
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }; //image add karynsathi
    await listing.save();
  }

  req.flash("success", "  Review  Updated!");
  res.redirect(`/listings/${id}`);
};

//delte route
module.exports.destroyListing = async (req, res) => {
  //1
  let { id } = req.params; //2
  let deleteListing = await Listing.findByIdAndDelete(id); //3
  console.log(deleteListing); //4                            req.flash("success","Listing  Deleted!");//flash
  res.redirect("/listings"); //5 delte sathi use kartt hai
};
