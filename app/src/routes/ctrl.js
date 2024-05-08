// src/routes/ctrl.js

const login = (req, res) => {
  res.render("login");
};

const signup = (req, res) => {
  res.render("signup");
};

const test = (req, res) => {
  res.render("test");
};

module.exports = {
  login,
  signup,
  test,
};
