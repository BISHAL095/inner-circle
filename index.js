require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const getMessages = require("./queries/getMessages");
const addUser = require("./queries/addUser");
const getUserByEmail = require("./queries/getUserByEmail");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------------------- App Config -------------------- */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* -------------------- Session Setup -------------------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

/* -------------------- Middleware -------------------- */

// Attach logged-in user to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Protect authenticated routes
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

/* -------------------- Routes -------------------- */

app.get("/", (req, res) => {
  res.redirect("/messages");
});

app.get("/messages", async (req, res) => {
  const messages = await getMessages();
  res.render("messages", { messages });
});

/* -------------------- Signup -------------------- */

app.get("/signup", (req, res) => {
  res.render("sign-up");
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, secretCode } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.render("sign-up", { error: "All fields are required" });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    let role = "user";

    // Upgrade to member if correct secret provided
    if (secretCode && secretCode === process.env.MEMBER_SECRET) {
      role = "member";
    }

    await addUser(email, password, fullName, role);

    res.redirect("/login");

  } catch (err) {
    console.error(err);
    res.render("sign-up", { error: "Signup failed" });
  }
});

/* -------------------- Login -------------------- */

app.get("/login", (req, res) => {
  res.render("log-in");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("log-in", { error: "All fields are required" });
    }

    const user = await getUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return res.render("log-in", { error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("log-in", { error: "Invalid email or password" });
    }

    // Store safe user data in session
    req.session.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.redirect("/");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.render("log-in", { error: "Login failed" });
  }
});

/* -------------------- Upgrade Role -------------------- */

app.post("/upgrade", requireAuth, async (req, res) => {
  if (req.body.secretCode === process.env.MEMBER_SECRET) {
    req.session.user.role = "member";
  }
  res.redirect("/");
});

/* -------------------- Logout -------------------- */

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/* -------------------- Start Server -------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});