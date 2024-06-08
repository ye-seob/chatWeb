const login = (req, res) => {
  res.render("login");
};

const signup = (req, res) => {
  res.render("signup");
};

const home = (req, res) => {
  res.render("home");
};

const chat = (req, res) => {
  res.render("chatRoom");
};

const profile = (req, res) => {
  res.render("profile");
};

const setting = (req, res) => {
  res.render("setting");
};

module.exports = {
  login,
  signup,
  home,
  chat,
  profile,
  setting,
};
