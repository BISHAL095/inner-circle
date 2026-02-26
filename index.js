require("dotenv").config();

const express = require("express");
const path = require("path");
const sessionConfig = require("./config/session");
const passport = require("passport");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- App Config ---------- */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------- Session + Passport ---------- */

app.use(sessionConfig);
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

/* ---------- Global View User ---------- */

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(express.static("public"));
/* ---------- Routes ---------- */



app.use("/", authRoutes);
app.use("/", messageRoutes);

/* ---------- Server ---------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});