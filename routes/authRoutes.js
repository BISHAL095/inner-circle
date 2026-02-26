const router = require("express").Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const { requireAuth } = require("../middleware/authMiddleware");


router.get("/", (req, res) => {
  res.redirect("/messages");
});

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

router.get("/upgrade", requireAuth, (req, res) => {
  res.render("upgrade", { error: null });
});

router.post("/upgrade", authController.upgradeRole);

module.exports = router;