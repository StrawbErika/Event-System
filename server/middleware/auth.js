exports.isLoggedIn = (req, res, callback) => {
  if (req.user) {
    return callback();
  }
  res.status(403);
  res.send("Not logged in");
};
