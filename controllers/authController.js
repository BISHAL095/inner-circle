const addUser = require("../queries/addUser");

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