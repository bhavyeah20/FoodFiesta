const Restaurant = require("../models/restaurant");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  const review = new Review(req.body.review);
  restaurant.reviews.push(review);
  review.author = req.user._id;
  await review.save();
  await restaurant.save();
  req.flash("success", "Successfully added your review!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/restaurants/${id}`);
};
