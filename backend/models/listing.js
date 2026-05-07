import mongoose, { set } from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url : String,
        filename : String,
    }, 
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country : {
        type: String,
        required: true
    },
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    slug: {
        type: String,
        unique: true
    }
});

listingSchema.pre("save", function() {
    if (!this.isModified("title") && this.slug) return;
    this.slug = this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove non-word characters
        .replace(/\s+/g, "-")      // Replace spaces with -
        .replace(/-+/g, "-")       // Replace multiple - with single -
        .trim();
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);

export default Listing;

