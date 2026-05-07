import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
    , default: []
});

UserSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

export default User;