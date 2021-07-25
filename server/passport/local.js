const LocalStrategy = require("passport-local").Strategy;
const { db } = require("../db");
const passport = require("passport");

const strategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async function (username, password, done) {
    const userRes = await db("users").select().where({
      username: username,
      password: password,
      // TODO: hash password
    });
    const user = userRes[0];
    if (!user) {
      return done(null, false, { message: "User/Password is not valid." });
    }
    return done(null, user);
  }
);

const serialize = (user, done) => {
  done(null, user.id);
};

const deserialize = async (id, done) => {
  const userRes = await db("users").select().where({
    id: id,
  });
  const user = userRes[0];
  done(null, user);
};

const initialize = () => {
  passport.use(strategy);
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
};

exports.initialize = initialize;
