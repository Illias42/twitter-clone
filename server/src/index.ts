import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import multer from "multer";
import "./authStrategies";
import mongoose from "mongoose";

import TweetControllers from "./controllers/TweetControllers";
import UserControllers from "./controllers/UserControllers";

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
app.use(express.static('public'));
app.use(passport.initialize())
app.use(passport.session())


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatars');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const imagesUpload = multer({storage: imageStorage});
const avatarUpload = multer({storage: avatarStorage});


app.post('/register', avatarUpload.single("avatar"), UserControllers.register);
app.post('/login', passport.authenticate("local"), UserControllers.login)
app.get('/userdata', passport.authenticate("jwt"), UserControllers.userData)

app.post('/createtweet', passport.authenticate("jwt"), imagesUpload.array("pics"), TweetControllers.createtweet);
app.get('/tweets', passport.authenticate("jwt"), TweetControllers.tweets);
app.get('/tweet/:id', passport.authenticate("jwt"), TweetControllers.getTweet);
app.post('/tweet/:id/reply', passport.authenticate("jwt"), TweetControllers.replyTweet);
app.get('/tweet/:id/replies', passport.authenticate("jwt"), TweetControllers.getReplies);
app.get('/profile/:id', passport.authenticate("jwt"), TweetControllers.getUserData);
app.get('/profile/:id/tweets', passport.authenticate("jwt"), TweetControllers.getUserTweets);
app.get('/profile/:id/liked', passport.authenticate("jwt"), TweetControllers.getLikedTweets);
app.get('/profile/:id/followers', passport.authenticate("jwt"), UserControllers.getFollowers);
app.get('/profile/:id/followings', passport.authenticate("jwt"), UserControllers.getFollowings);
app.post('/profile/:id/follow', passport.authenticate("jwt"), UserControllers.follow);
app.post('/profile/:id/unfollow', passport.authenticate("jwt"), UserControllers.unfollow);
app.post('/tweet/:id/like', passport.authenticate("jwt"), TweetControllers.like);
app.post('/tweet/:id/unlike', passport.authenticate("jwt"), TweetControllers.unlike);
app.post('/tweet/:id/addbookmark', passport.authenticate("jwt"), TweetControllers.addBookmark);
app.post('/tweet/:id/removebookmark', passport.authenticate("jwt"), TweetControllers.removeBookmark);
app.get('/user/bookmarks', passport.authenticate("jwt"), TweetControllers.getBookmarks);

app.listen(8000);