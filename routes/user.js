import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware/middleware.js";

import { 
    getRegister,
    createUser,
    loginUser,
    authenticateUser,
    logoutUser,

} from "../controllers/users.js";

const router = Router();

//combine routes
router
.route("/signup")
    .get(getRegister)
    .post(wrapAsync(createUser));


router.route("/login")
    .get(loginUser)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {failureRedirect: "/login", failureFlash: true }),
        authenticateUser, 
    );

    
//logout route 
router.get("/logout", logoutUser);

//we can combine the routes like this in the above code

// //signup route 
// router.get("/signup", getRegister);


// //signup route creating a new user
// router.post("/signup", wrapAsync(createUser));


// //login route
// router.get("/login", loginUser);


// //login route authenticating user
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {failureRedirect: "/login", failureFlash: true }),
//     authenticateUser, 
// );


// //logout route 
// router.get("/logout", logoutUser);


export {router as userRouter};  