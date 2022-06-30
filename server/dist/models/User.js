import mongoose from "mongoose";
const { Schema, model } = mongoose;
export const UserSchema = new Schema({
    _id: { type: String, required: false },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    tag: String,
    likedTweets: [String],
    bookmarks: [String],
    followers: [String],
    followings: [String],
    email: { type: String, required: true },
    avatar: String,
    password: { type: String, required: true },
    salt: { type: String, required: true }
});
export const UserModel = model('User', UserSchema);
