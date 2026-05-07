import Listing from '../models/listing.js';
import User from '../models/user.js';
import ExpressError from '../utils/expressError.js';

// toggle wishlist
export const toggleWishlist = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.wishlist) {
        user.wishlist = [];
    }

    const index = user.wishlist.findIndex(wishId => wishId.toString() === id.toString());
    if (index === -1) {
        user.wishlist.push(id);
        req.flash("success", "Added to wishlist!");
    } else {
        user.wishlist.splice(index, 1);
        req.flash("success", "Removed from wishlist!");
    }

    await user.save();
    
    if (req.query.from === "wishlist") {
        return res.redirect("/listings/wishlist");
    }
    
    if (req.query.from === "index") {
        return res.redirect("/listings");
    }
    
    // Fetch listing to get slug for pretty redirect
    const listing = await Listing.findById(id);
    res.redirect(`/listings/${listing.slug || id}`);
};



//all listings callback
export const getAllListings = async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};


//new listing callback
export const getNewListing = (req, res) => {
    res.render("listings/new.ejs");
};


//show listing callback
export const getListing = async (req, res) => {
    const { id } = req.params;
    
    let listing;
    // Try finding by ID if it looks like an ObjectId, otherwise find by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        listing = await Listing.findById(id);
    } 
    
    if (!listing) {
        listing = await Listing.findOne({ slug: id });
    }

    if (!listing) throw new ExpressError(404, "Page Not Found");

    // Populate after finding
    await listing.populate({
      path : "reviews",
      populate : { 
        path : "author",
      },
    });
    await listing.populate("owner");

    if (!listing) throw new ExpressError(404, "Page Not Found");
    res.render("listings/show.ejs", { listing });
};


//create listing callback
export const createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newlisting.slug}`);
};


//edit listing callback
export const getEditListing = async (req, res) => {
    const { id } = req.params;
    let listing;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        listing = await Listing.findById(id);
    }
    if (!listing) {
        listing = await Listing.findOne({ slug: id });
    }
    
    if (!listing) throw new ExpressError(404, "Page Not Found");
    res.render("listings/edit.ejs", { listing });
};


//update listing callback
export const updateLisiting = async (req, res) => {
    let { id } = req.params;
    let listing;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
    } else {
        listing = await Listing.findOneAndUpdate({ slug: id }, req.body.listing, { runValidators: true, new: true });
    }

    if (!listing) throw new ExpressError(404, "Page Not Found");

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing.slug}`);
};


//delete listing callback
export const deleteListing = async (req, res) => {
    let deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) throw new ExpressError(404, "Listing Not Found");
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};


//search listings callback
export const searchListings = async (req, res) => {
    const { query } = req.query;

    try {
        // Split query into words to find partial matches (e.g., "Amazing Pools" -> "Amazing", "Pools")
        const keywords = query.split(" ").filter(w => w.length > 0);
        const searchRegex = keywords.map(word => new RegExp(word, 'i'));

        const listings = await Listing.find({
            $or: [
                { title: { $in: searchRegex } },
                { description: { $in: searchRegex } },
                { location: { $in: searchRegex } },
                { country: { $in: searchRegex } }
            ]
        });

        if (listings.length === 0) {
            req.flash('error', `No listings found for ${query}`);
            return res.redirect('/listings');
        }

        res.render("listings/index.ejs", { listings }); // reuse your main listing template
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};