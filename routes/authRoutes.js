const router = require("express").Router();
const authController = require("../controllers/authController");
const passport = require("passport");

router.get("/signup", authController.showSignup);
router.post("/signup", authController.signup);

router.get("/login", (req, res) => {
  res.render("log-in");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/logout", (req, res, next) => {
  req.logout(function () {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

module.exports = router;