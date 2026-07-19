const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const childRoutes = require("./routes/childRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/children", childRoutes);
app.use("/api/attendance",attendanceRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Shepherd API"
  });
});

module.exports = app;