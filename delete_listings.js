import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./backend/models/listing.js";

dotenv.config();

const titlesToDelete = [
    // Batch 1
    "Modern Apartment in Tokyo",
    "Luxury Penthouse with City Views",
    "Cozy Beachfront Cottage",
    "Historic Brownstone in Boston",
    "Rustic Cabin by the Lake",
    "Eco-Friendly Treehouse Retreat",
    "Lakefront Cabin in New Hampshire",
    "Ski Chalet in Aspen",
    // Batch 2
    "Safari Lodge in the Serengeti",
    "Historic Canal House",
    "Mountain Retreat",
    "Beachfront Paradise",
    "Rustic Log Cabin in Montana",
    "Tropical Villa in Phuket",
    "Luxury Villa in the Maldives",
    "Private Island Retreat",
    "Ski-In/Ski-Out Chalet"
];

async function deleteSpecificListings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const result = await Listing.deleteMany({
            title: { $in: titlesToDelete }
        });

        console.log(`Successfully deleted ${result.deletedCount} listings from the database.`);

    } catch (err) {
        console.error("Error deleting listings:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

deleteSpecificListings();
