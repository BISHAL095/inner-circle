const addUser = require("../queries/addUser");
const upgradeRoleQuery = require("../queries/upgradeRole");

exports.showSignup = (req, res) => {
  res.render("sign-up", { error: null });
};

exports.signup = async (req, res) => {
  try {

    let { firstName, lastName, email, password, secretCode } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.render("sign-up", {
        error: "All fields are required"
      });
    }

    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();

    const fullName = `${firstName} ${lastName}`;

    let role = "user";

    if (secretCode === process.env.MEMBER_SECRET) {
      role = "member";
    }

    await addUser(email, password, fullName, role);

    res.redirect("/login");

  } catch (err) {

    if (err.code === "23505") {
      return res.render("sign-up", {
        error: "Email already registered. Please log in."
      });
    }

    res.render("sign-up", { error: "Signup failed. Try again." });
  }
};


exports.upgradeRole = async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (secretCode !== process.env.MEMBER_SECRET) {
      return res.render("upgrade", { error: "Invalid secret code" });
    }

    const updatedUser = await upgradeRoleQuery(req.user.id, "member");

    // Update session user
    req.login(updatedUser, (err) => {
      if (err) throw err;
      res.redirect("/");
    });

  } catch (err) {
    console.error(err);
    res.render("upgrade", { error: "Something went wrong" });
  }
};