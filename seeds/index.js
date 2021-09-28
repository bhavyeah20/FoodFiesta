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
      author: "613b349088034c00169f5c7c",
      images: [
        {
          url: "https://res.cloudinary.com/dwtkhznmd/image/upload/v1631271104/FoodFiesta/photo-1514933651103-005eec06c04b_dbjaan.jpg",
          filename: "FoodFiesta/photo-1514933651103-005eec06c04b_dbjaan",
        },
        {
          url: "https://res.cloudinary.com/dwtkhznmd/image/upload/v1631252847/FoodFiesta/photo-1504754524776-8f4f37790ca0_kdyhjm.jpg",
          filename: "FoodFiesta/photo-1504754524776-8f4f37790ca0_kdyhjm",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].lng, cities[random1000].lat],
      },
      description: `${sample(description)}`,
      price: Math.floor(Math.random() * 1000) + 200,
    });
    await restt.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
