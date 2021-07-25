const { initialize: initLocalStrategy } = require("./passport/local");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();

var cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

const { isLoggedIn } = require("./middleware/auth");
const bodyParser = require("body-parser");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("App listening on port " + port));

const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());
initLocalStrategy();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var sessionRouter = require("./routes/session");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", isLoggedIn, usersRouter);
app.use("/session", sessionRouter);

app.use(express.static(__dirname));

module.exports = app;
