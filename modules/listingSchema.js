const mongoose = require("mongoose");
// used a script to generate the following from mongosh shell automatically
// i am not sure if this is the correct way to do it
const listingSchema = new mongoose.Schema(
  {
    _id: { type: String },
    listing_url: { type: String },
    name: { type: String },
    summary: { type: String },
    space: { type: String },
    description: { type: String },
    neighborhood_overview: { type: String },
    notes: { type: String },
    transit: { type: String },
    access: { type: String },
    interaction: { type: String },
    house_rules: { type: String },
    property_type: { type: String },
    room_type: { type: String },
    bed_type: { type: String },
    minimum_nights: { type: String },
    maximum_nights: { type: String },
    cancellation_policy: { type: String },
    last_scraped: { type: Date },
    calendar_last_scraped: { type: Date },
    first_review: { type: Date },
    last_review: { type: Date },
    accommodates: { type: Number },
    bedrooms: { type: Number },
    beds: { type: Number },
    number_of_reviews: { type: Number },
    bathrooms: { type: mongoose.Schema.Types.Mixed },
    amenities: { type: [String] },
    price: { type: mongoose.Schema.Types.Mixed },
    security_deposit: { type: mongoose.Schema.Types.Mixed },
    cleaning_fee: { type: mongoose.Schema.Types.Mixed },
    extra_people: { type: mongoose.Schema.Types.Mixed },
    guests_included: { type: mongoose.Schema.Types.Mixed },
    images: { type: Object },
    host: { type: Object },
    address: { type: Object },
    availability: { type: Object },
    review_scores: { type: Object },
    reviews: { type: Object },
  },
  { collection: "listingsAndReviews" }
);

module.exports = mongoose.model("Listing", listingSchema);
