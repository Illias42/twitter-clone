import mongoose from "mongoose";
const {Schema, model} = mongoose;

export interface ITweet {
    _id: string;
    text: string;
    userId: string;
    pics: string[];
    replies: Reply[];
    likes: number;
    bookmarksCount: number;
    replyCount: number;
    createdAt: Date;
}

export interface Reply {
    text: string;
    user: {
        _id: string;
        name: string;
        tag?: string;
        avatar: string;
    };
}

export interface TweetDto {
    _id: string;
    text: string;
    user: {
        _id: string;
        name: string;
        tag?: string;
        avatar: string;
    };
    pics: string[];
    replyCount: number;
    replies?: Reply[];
    likes: number;
    bookmarksCount: number;
}

export const TweetSchema = new Schema<ITweet & Document>({
    _id: {type: String, required: false},
    text: {type: String, required: true},
    userId: {type: String, required: true},
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
})

export const TweetModel = model<ITweet & Document>('Tweet', TweetSchema);