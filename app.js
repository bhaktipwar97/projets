if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET)

const express = require("express"); //.............
const app = express(); //.....................
const mongoose = require("mongoose"); //..............
// const  Listing=require('./models/listing.js');//...........b
const path = require("path"); //.................//
const methodOverride = require("method-override"); //edit put lihlvr mg he takych
const ejsMate = require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session"); //...........
// const MongoStore = require('connect-mongo');
const flash = require("connect-flash"); //flash
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");

// const Review= require('./models/review.js');//reviews
const Joi = require("joi");


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });




async function main() {
  await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 

app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method")); 

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); 



const sessionOptions = {
  // store,
  secret: "mysupersecretcode",
  // secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions)); 
app.use(flash()); //flash

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.error = req.flash("error"); //res.local
  res.locals.success = req.flash("success"); //res.local
  res.locals.currUser = req.user;
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.use((err, req, res, next) => {
  // res.send("something went wrong")
  let { statusCode = 500, message = " something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  
  console.log("server is lintening to post 8080"); 
}); 
