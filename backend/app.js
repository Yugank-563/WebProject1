import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMatePkg from "ejs-mate";
const ejsMate = ejsMatePkg.default || ejsMatePkg;
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import localStrategyPkg from "passport-local";
const localStrategy = localStrategyPkg.Strategy || localStrategyPkg;

if(process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env" });
}

//importing models
import User from "./models/user.js";

//importing routes
import ExpressError from "./utils/expressError.js";

//import routes
import {listingsRouter} from "./routes/listing.js";
import {reviewsRouter} from "./routes/review.js";
import {userRouter} from "./routes/user.js";

const app = express();

//dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//ejs-mate
app.engine("ejs", ejsMate);

const dburl = process.env.MONGO_URI;

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});


store.on("error", (e)=> {
  console.error("Session store error", e);
});


const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7, //1 week
    maxAge : 1000 * 60 * 60 * 24 * 7,
  },

}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
 
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


//routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Favicon handler
app.get("/favicon.ico", (req, res) => res.status(204).end());

//Used for when the user tries to access a route that doesn't exist
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    if (statusCode !== 404) {
        console.error(err); // Only log real errors, not 404s
    }
    res.status(statusCode).render("error.ejs", { err });
});

export default app;
