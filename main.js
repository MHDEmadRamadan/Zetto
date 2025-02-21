const express = require("express");
const app = express();
const package = require("./src/routes/packageRoute");
const user = require("./src/routes/userRouter");
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("this server is working on port: ", port);
});
