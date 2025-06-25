import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";


if(process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./.env" });
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
const port = 3000;  


//dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//ejs-mate
app.engine("ejs", ejsMate);

//Connect to DB
// const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";

const dburl = process.env.MONGO_URI;


main()
  .then(() => console.log("Connected to MongoDB... "))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

async function main() {
  await mongoose.connect(dburl);
}

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});


store.on("error", (e)=> {
  console.log("Session store error", e);
});


// console.log(dburl);
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



//Used for when the user tries to access a route that doesn't exist
app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    console.error(err);
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
