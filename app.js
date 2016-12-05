var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require ("passport");
var setUpPassport = require("./setuppassport");

var router = require("./routes");
var User = require("./models/user");

var app = express();
mongoose.connect("mongodb://localhost:27017/test");
setUpPassport();
app.set("port",process.env.PORT||3000);
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:"TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  resave:true,
  saveUninitialized:true
}));
app.use(flash());
app.use(router);

router.get("/signup", function(req, res) {
  res.render("signup");
});
router.post("/signup", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
    var newUser = new User({
    username: username,
    password: password
  });
  newUser.save(next);
  });
},
 passport.authenticate("login", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
}));

app.listen(app.get("port"),function(){
  console.log("srever started on port"+app.get("port"));
});
