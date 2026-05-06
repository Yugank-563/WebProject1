import mongoose from "mongoose";
import initData from "./testData.js";
import listing from "../models/listing.js"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const dburl = process.env.MONGO_URI;

import User from "../models/user.js";

const initDB = async () => {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to DB for initialization...");
        
        // Find a real user to be the owner
        const defaultOwner = await User.findOne();
        if (!defaultOwner) {
            console.error("CRITICAL: No users found in database! Please sign up first.");
            await mongoose.disconnect();
            return;
        }

        await listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: defaultOwner._id,
        }));
        await listing.insertMany(initData.data);
        console.log("All the listings have been added successfully!");
        
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error during initialization:", err);
    }
}

// If this file is run directly (npm run reset-db)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    initDB();
}

export { initDB }; 