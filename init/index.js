import mongoose from "mongoose";

import initData from "./data.js";
import listing from "../models/listing.js"; 
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });



// const MONGO_URI = "mongodb://127.0.0.1:27017/wanderlust";

const dburl = process.env.MONGO_URI;


main()
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

async function main() {
    await mongoose.connect(dburl);
}


const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: '681252507bad6050e3203e44',
    }));
    await listing.insertMany(initData.data);
    console.log("All the listings have been added");
    await mongoose.disconnect();
}

initDB(); 