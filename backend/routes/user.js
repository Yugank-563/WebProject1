import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { isLoggedIn, saveRedirectUrl } from "../middleware/middleware.js";

import { 
    getRegister,
    createUser,
    loginUser,
    authenticateUser,
    logoutUser

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

export {router as userRouter};