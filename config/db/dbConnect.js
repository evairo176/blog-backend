const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URL, {
      // useCreateIndex: true,
      // useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log("Error: " + error.message);
  }
};

module.exports = dbConnect;
