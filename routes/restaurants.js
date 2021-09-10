const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const { validateRestaurant, isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const Restaurant = require("../models/restaurant");
const restaurants = require("../controllers/restaurants");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(restaurants.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateRestaurant,
    catchAsync(restaurants.createRestaurant)
  );

router.get("/new", isLoggedIn, restaurants.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(restaurants.showRestaurant))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateRestaurant,
    catchAsync(restaurants.updateRestaurant)
  )
  .delete(isLoggedIn, catchAsync(restaurants.deleteRestaurant));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(restaurants.renderEditForm)
);

module.exports = router;
