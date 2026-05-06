import User from "../models/user.js";

//register user callback
export const getRegister = (req, res) => {
    res.render("user/signup.ejs");
};

//create user callback
export const createUser = async (req, res) => {
       try{
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            console.log("user registered :" ,registeredUser);
            req.flash("success", "Welcome to Wanderlust!");
            req.session.save(() => {
                res.redirect("/listings");
            });
        });
       } catch (err){
        req.flash("error", err.message);
        res.redirect("/signup");
       }
};

//login user callback
export const loginUser = (req, res) => {
    res.render("user/login.ejs");
};

//aurhenticate user callback
export const authenticateUser = async(req, res) => {
    req.flash("success", "Welcome back!"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.session.save(() => {
        res.redirect(redirectUrl);
    });
};

//logout user callback
export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "you have logged out successfully!");
        req.session.save(() => {
            res.redirect("/listings");
        });
    });
};
