// /src/session/session.js

const session = require("express-session");
const MongoStore = require("connect-mongo");

function createSessionStore(mongoUrl) {
  const store = MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: "sessions",
  });

  const sessionMiddleware = session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  });

  return sessionMiddleware;
}

module.exports = createSessionStore;
