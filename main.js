const express = require("express");
const app = express();
const packageRoutes = require("./src/routes/packageRoute");
const userRoutes = require("./src/routes/userRouter");
app.use(express.json());

// app.use("/api/package", packageRoutes);
app.use("/api/user", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("this server is working on port: ", port);
});
