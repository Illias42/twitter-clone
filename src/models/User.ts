import mongoose from "mongoose";
const { Schema, model } = mongoose;

export interface IUser {
    _id: string;
    name: string;
    surname: string;
    tag?: string;
    likedTweets: string[];
    bookmarks: string[];
    followers: string[];
    followings: string[];
    email: string;
    avatar: string;
    password: string;
    salt: string;
}

export type UserDocument = IUser & mongoose.Document;

export const UserSchema = new Schema<UserDocument>({
    _id: {type: String, required: false},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    tag: String,
    likedTweets: [String],
    bookmarks: [String],
    followers: [String],
    followings: [String],
    email: {type: String, required: true},
    avatar: String,
    password: {type: String, required: true},
    salt: {type: String, required: true}
})

export const UserModel = model<UserDocument>('User', UserSchema);