const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant");
const cities = require("./cities");
const { places, descriptors, description } = require("./seedHelpers");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/food-fiesta";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Restaurant.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 400);
    const restt = new Restaurant({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
      //Your User ID
      author: "613af5945db76f0868602b36",
      images: [
        {
          url: "https://res.cloudinary.com/dwtkhznmd/image/upload/v1631252966/FoodFiesta/photo-1514933651103-005eec06c04b_yx9nbc.jpg",
          filename: "FoodFiesta/photo-1514933651103-005eec06c04b_yx9nbc",
        },
        {
          url: "https://res.cloudinary.com/dwtkhznmd/image/upload/v1631252807/FoodFiesta/photo-1504674900247-0877df9cc836_ufyrke.jpg",
          filename: "FoodFiesta/photo-1504674900247-0877df9cc836_ufyrke",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].lng, cities[random1000].lat],
      },
      description: `${sample(description)}`,
      price: Math.floor(Math.random() * 20) + 10,
    });
    await restt.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
