const mongoose = require("mongoose"); 
const review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema; 

const listingSchema = new Schema({
  

  title: {
    type: String, 
    required: true, 
  },
  description: String, 
  image: {
    
    url: String,
    filename: String,
   
  },
  price: Number, 
  location: String, 
  country: String,

  //reviews///
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },

    category: {
      type: String,
      enum: ["mountain", "arctic", "farms", "desert"],
    },
  },
  ///review end
}); 

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing; 
