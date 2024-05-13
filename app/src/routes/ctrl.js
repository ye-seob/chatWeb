// src/routes/ctrl.js

const login = (req, res) => {
  res.render("login");
};

const signup = (req, res) => {
  res.render("signup");
};

const home = (req, res) => {
  res.render("home");
};

module.exports = {
  login,
  signup,
  home,
};
