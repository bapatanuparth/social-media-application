const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// The .env file is a file where you can store sensitive configuration information, such as API keys or database credentials, outside of your codebase. The file contains key-value pairs,
dotenv.config(); //This makes it easy to access environment variables in your code using process.env.<variable_name>.

mongoose
  .connect(process.env.MONGO_URL, {
    //optional parameters to configure the driver's behavior
    useNewUrlParser: true, //useNewUrlParser is a boolean option that determines whether or not to use the new MongoDB driver's URL parser
    useUnifiedTopology: true, //useUnifiedTopology is a boolean option that determines whether or not to use the new MongoDB driver's topology engine.
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

//middleware
//these functions execute ion the order in which they are added on the stack
app.use(express.json()); //parses incomiong json payloads, typically used for HTTP POST requests
app.use(helmet()); //security for the HTTP
app.use(morgan("common")); //logs HTTP requests to console, helpful to debug and monitor traffic

app.use("/api/users", userRoute); //whenever we hit/api/users, we use the router created for users in routs folder
app.use("/api/auth", authRoute);
//
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend ready");
});
