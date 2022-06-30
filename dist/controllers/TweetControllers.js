var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from "../models/User";
import { v4 } from "uuid";
import { TweetModel } from "../models/Tweet";
export default {
    createtweet: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text, userId } = req.body;
                const pics = [];
                console.log(req.files);
                Array.from(req.files).forEach(pic => {
                    // @ts-ignore
                    pics.push(pic.location);
                });
                const tweet = new TweetModel({
                    _id: v4().toString(),
                    text: text,
                    userId: userId,
                    pics: pics,
                    replies: [],
                    likes: 0,
                    bookmarksCount: 0,
                    createdAt: Date.now()
                });
                yield tweet.save();
                res.status(200).send("New tweet was created!");
            }
            catch (err) {
                console.log(err);
                res.status(500).send("Something goes wrong!");
            }
        });
    },
    tweets: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, size } = req.query;
                if (skip && size) {
                    const records = yield TweetModel.find().sort({ createdAt: -1 }).skip(+skip).limit(+size).exec();
                    const tweets = yield Promise.all(records.map((tweet) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield UserModel.findOne({ _id: tweet.userId }).exec();
                        return {
                            _id: tweet._id,
                            text: tweet.text,
                            pics: tweet.pics,
                            user: {
                                _id: user === null || user === void 0 ? void 0 : user._id,
                                name: user === null || user === void 0 ? void 0 : user.name,
                                avatar: user === null || user === void 0 ? void 0 : user.avatar
                            },
                            likes: tweet.likes,
                            bookmarksCount: tweet.bookmarksCount,
                            replyCount: tweet.replies.length
                        };
                    })));
                    res.status(200).json(tweets);
                }
                else {
                    res.status(500).send("'skip' and 'size' params required");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    getTweet: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                if (tweet !== null) {
                    const { _id, name, avatar } = yield UserModel.findOne({ _id: tweet.userId }).exec();
                    res.status(200).json({
                        _id: tweet._id,
                        text: tweet.text,
                        pics: tweet.pics,
                        user: {
                            _id,
                            name,
                            avatar
                        },
                        bookmarksCount: tweet.bookmarksCount,
                        likes: tweet.likes,
                        replyCount: tweet.replies.length
                    });
                }
                else {
                    res.status(404).send(":(");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    replyTweet: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { text } = req.body;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                if (tweet !== null && req.user) {
                    const reply = {
                        text: text,
                        user: {
                            _id: req.user._id,
                            name: req.user.name,
                            avatar: req.user.avatar
                        }
                    };
                    tweet.replies.unshift(reply);
                    yield tweet.save();
                    res.status(200).send("OK");
                }
                else {
                    res.status(404).send(":(");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    getReplies: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                if (tweet !== null) {
                    res.status(200).send(tweet.replies);
                }
                else {
                    res.status(404).send(":(");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    getUserTweets: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, size } = req.query;
                const { id } = req.params;
                if (skip && size) {
                    const records = yield TweetModel.find({ userId: id }).sort({ createdAt: -1 }).skip(+skip).limit(+size).exec();
                    const tweets = yield Promise.all(records.map((tweet) => __awaiter(this, void 0, void 0, function* () {
                        const { _id, name, avatar } = yield UserModel.findOne({ _id: tweet.userId }).exec();
                        return {
                            _id: tweet._id,
                            text: tweet.text,
                            pics: tweet.pics,
                            user: {
                                _id,
                                name,
                                avatar
                            },
                            likes: tweet.likes,
                            bookmarksCount: tweet.bookmarksCount,
                            replyCount: tweet.replies.length
                        };
                    })));
                    res.status(200).json(tweets);
                }
                else {
                    res.status(500).send("'skip' and 'size' params required");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    getLikedTweets: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { skip, size } = req.query;
                const { id } = req.params;
                if (skip && size) {
                    const user = yield UserModel.findOne({ _id: id }).exec();
                    if (user && (+skip < user.likedTweets.length)) {
                        const tweets = yield Promise.all(user.likedTweets.map((_id, index) => __awaiter(this, void 0, void 0, function* () {
                            console.log("1");
                            //@ts-ignore
                            if (index >= (+skip) - 1 && index < (+skip - 1) + (+size)) {
                                console.log("2");
                                const tweet = yield TweetModel.findOne({ _id: _id }).exec();
                                return {
                                    _id: tweet._id,
                                    text: tweet.text,
                                    pics: tweet.pics,
                                    user: {
                                        _id: user._id,
                                        name: user.name,
                                        avatar: user.avatar
                                    },
                                    likes: tweet.likes,
                                    bookmarksCount: tweet.bookmarksCount,
                                    replyCount: tweet.replies.length
                                };
                            }
                        })));
                        console.log(tweets);
                        res.status(200).json(tweets);
                    }
                    else {
                        res.status(200).json([]);
                    }
                }
                else {
                    res.status(500).send("'skip' and 'size' params required");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    like: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user._id;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                const user = yield UserModel.findOne({ _id: userId }).exec();
                if (tweet && user && !user.likedTweets.includes(id)) {
                    tweet.likes += 1;
                    user.likedTweets.push(tweet._id);
                    yield tweet.save();
                    yield user.save();
                    res.status(200).send("Ok");
                }
                else {
                    res.status(500).send("Something wrong");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    unlike: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user._id;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                const user = yield UserModel.findOne({ _id: userId }).exec();
                if (tweet && user && user.likedTweets.includes(id)) {
                    tweet.likes -= 1;
                    user.likedTweets = user.likedTweets.filter(function (likedTweetId) {
                        return likedTweetId !== tweet.id;
                    });
                    yield tweet.save();
                    yield user.save();
                    res.status(200).send("Ok");
                }
                else {
                    res.status(500).send("Something wrong");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    addBookmark: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user._id;
                const tweet = yield TweetModel.findOne({ _id: id }).exec();
                const user = yield UserModel.findOne({ _id: userId }).exec();
                if (tweet && user && !user.likedTweets.includes(id)) {
                    tweet.bookmarksCount += 1;
                    user.bookmarks.push(tweet.id);
                    yield tweet.save();
                    yield user.save();
                    res.status(200).send("Ok");
                }
                else {
                    res.status(500).send("Something wrong");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    getBookmarks: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { skip, size } = req.query;
                const { _id } = req.user;
                if (skip && size) {
                    const user = yield UserModel.findOne({ _id: _id }).exec();
                    if (user && (+skip < user.bookmarks.length)) {
                        const tweets = yield Promise.all(user.bookmarks.map((_id, index) => __awaiter(this, void 0, void 0, function* () {
                            console.log("1");
                            //@ts-ignore
                            if (index >= (+skip) - 1 && index < (+skip - 1) + (+size)) {
                                console.log("2");
                                const tweet = yield TweetModel.findOne({ _id: _id }).exec();
                                return {
                                    _id: tweet._id,
                                    text: tweet.text,
                                    pics: tweet.pics,
                                    user: {
                                        _id: user._id,
                                        name: user.name,
                                        avatar: user.avatar
                                    },
                                    likes: tweet.likes,
                                    bookmarksCount: tweet.bookmarksCount,
                                    replyCount: tweet.replies.length
                                };
                            }
                        })));
                        console.log(tweets);
                        res.status(200).json(tweets);
                    }
                    else {
                        res.status(200).json([]);
                    }
                }
                else {
                    res.status(500).send("'skip' and 'size' params required");
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    },
    removeBookmark: (req, res) => { },
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield UserModel.findOne({ _id: id }).exec();
            if (user) {
                res.status(200).json({
                    _id: id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    surname: user === null || user === void 0 ? void 0 : user.surname,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    avatar: user === null || user === void 0 ? void 0 : user.avatar,
                    likedTweets: user === null || user === void 0 ? void 0 : user.likedTweets,
                    bookmarks: user === null || user === void 0 ? void 0 : user.bookmarks,
                    followers: user === null || user === void 0 ? void 0 : user.followers,
                    followings: user === null || user === void 0 ? void 0 : user.followings
                });
            }
            else {
                res.status(500).send("Something goes wrong");
            }
        }
        catch (err) {
            console.log(err);
        }
    })
};
