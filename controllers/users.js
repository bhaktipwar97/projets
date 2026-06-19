const User = require("../models/user");
//signup page
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//signup route
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registereUser = await User.register(newUser, password);
    console.log(registereUser);
    req.login(registereUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("signup");
  }
};

//login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//login route
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome  back to wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout
module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you area logged out!");
    res.redirect("/listings");
  });
};
