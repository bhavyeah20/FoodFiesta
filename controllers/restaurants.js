const Restaurant = require("../models/restaurant");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.render("restaurants/index", { restaurants });
};

module.exports.renderNewForm = (req, res) => {
  res.render("restaurants/new");
};

module.exports.createRestaurant = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.restaurant.location,
      limit: 1,
    })
    .send();
  const restaurant = new Restaurant(req.body.restaurant);
  restaurant.geometry = geoData.body.features[0].geometry;
  restaurant.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.author = req.user._id;
  await restaurant.save();
  req.flash("success", "Succesfully made a restaurant!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.showRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!restaurant) {
    req.flash("error", "Can't find that Restaurant!");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/show", { restaurant });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    req.flash("error", "Can't find that Restaurant!");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/edit", { restaurant });
};

module.exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  // console.log("REQUEST BODY", req.body);
  const restaurant = await Restaurant.findByIdAndUpdate(id, {
    ...req.body.restaurant,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  restaurant.images.push(...imgs);
  await restaurant.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await restaurant.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Restaurant updated!");
  res.redirect(`/restaurants/${restaurant._id}`);
};

module.exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  req.flash("success", "Restaurant deleted!");
  res.redirect("/restaurants");
};
