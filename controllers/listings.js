import Listing from '../models/listing.js';
import ExpressError from '../utils/expressError.js';



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
    const listing = await Listing.findById(req.params.id)
    .populate({
      path : "reviews",
      populate : { 
        path : "author",
      },
    })
    .populate("owner");

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
    res.redirect(`/listings`);
};


//edit listing callback
export const getEditListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Page Not Found");
    res.render("listings/edit.ejs", { listing });
};


//update listing callback
export const updateLisiting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, {
      runValidators: true,
      new: true,
    });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    console.log("updated listing :", listing);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};


//delete listing callback
export const deleteListing = async (req, res) => {
    let deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) throw new ExpressError(404, "Listing Not Found");
    console.log("deleted listing :", deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};


//search listings callback
export const searchListings = async (req, res) => {
    const { query } = req.query;

    try {
        const listings = await Listing.find({
            // country: { $regex: new RegExp(country, 'i') } // case-insensitive match
            $or: [
                { country: { $regex: new RegExp(query, 'i') } },
                { location: { $regex: new RegExp(query, 'i') } }
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