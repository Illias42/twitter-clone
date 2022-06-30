import mongoose from "mongoose";
const { Schema, model } = mongoose;
export const TweetSchema = new Schema({
    _id: { type: String, required: false },
    text: { type: String, required: true },
    userId: { type: String, required: true },
    pics: [String],
    replies: [{
            text: String,
            user: {
                _id: String,
                name: String,
                avatar: String
            }
        }],
    likes: Number,
    bookmarksCount: Number,
    replyCount: Number,
    createdAt: Date
});
export const TweetModel = model('Tweet', TweetSchema);
