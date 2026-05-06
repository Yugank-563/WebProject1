import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initDB } from "./init/index.js";

dotenv.config({ path: "../.env" });

const port = process.env.PORT || 3000;
const dburl = process.env.MONGO_URI;

main()
  .then(async () => {
    console.log("Connected to MongoDB... ");
    
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

async function main() {
  if (!dburl) throw new Error("MONGO_URI is not defined");
  await mongoose.connect(dburl);
}
