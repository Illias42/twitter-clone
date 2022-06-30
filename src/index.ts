import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import { upload } from "./utils/s3";
import "./authStrategies";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

import TweetControllers from "./controllers/TweetControllers";
import UserControllers from "./controllers/UserControllers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {connect} = mongoose;

const app = express();
connect(process.env.MONGO_URL as string);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(passport.initialize())
app.use(passport.session())


app.post('/api/register', upload.single("avatar"), UserControllers.register);
app.post('/api/login', passport.authenticate("local"), UserControllers.login)
app.get('/api/userdata', passport.authenticate("jwt"), UserControllers.userData)

app.post('/api/createtweet', passport.authenticate("jwt"), upload.array("pics"), TweetControllers.createtweet);
app.get('/api/tweets', passport.authenticate("jwt"), TweetControllers.tweets);
app.get('/api/tweet/:id', passport.authenticate("jwt"), TweetControllers.getTweet);
app.post('/api/tweet/:id/reply', passport.authenticate("jwt"), TweetControllers.replyTweet);
app.get('/api/tweet/:id/replies', passport.authenticate("jwt"), TweetControllers.getReplies);
app.get('/api/profile/:id', passport.authenticate("jwt"), TweetControllers.getUserData);
app.get('/api/profile/:id/tweets', passport.authenticate("jwt"), TweetControllers.getUserTweets);
app.get('/api/profile/:id/liked', passport.authenticate("jwt"), TweetControllers.getLikedTweets);
app.get('/api/profile/:id/followers', passport.authenticate("jwt"), UserControllers.getFollowers);
app.get('/api/profile/:id/followings', passport.authenticate("jwt"), UserControllers.getFollowings);
app.post('/api/profile/:id/follow', passport.authenticate("jwt"), UserControllers.follow);
app.post('/api/profile/:id/unfollow', passport.authenticate("jwt"), UserControllers.unfollow);
app.post('/api/tweet/:id/like', passport.authenticate("jwt"), TweetControllers.like);
app.post('/api/tweet/:id/unlike', passport.authenticate("jwt"), TweetControllers.unlike);
app.post('/api/tweet/:id/addbookmark', passport.authenticate("jwt"), TweetControllers.addBookmark);
app.post('/api/tweet/:id/removebookmark', passport.authenticate("jwt"), TweetControllers.removeBookmark);
app.get('/api/user/bookmarks', passport.authenticate("jwt"), TweetControllers.getBookmarks);

app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(process.env.PORT || 8000);