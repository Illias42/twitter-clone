import {IUser, UserModel} from "../models/User";
import {v4} from "uuid";
import express from "express";
import {ITweet, Reply, TweetDto, TweetModel} from "../models/Tweet";

export default {
    createtweet: async function (req: any, res: express.Response) {
        try {
            const {text, userId} = req.body;
            const pics: string[] = [];

            Array.from(req.files as File[]).forEach(pic => {
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
            })
            await tweet.save();
            res.status(200).send("New tweet was created!");
        } catch (err) {
            console.log(err)
            res.status(500).send("Something goes wrong!");
        }
    },

    tweets: async function (req: any, res: express.Response) {
        try {
            const {skip, size} = req.query;
            if (skip && size) {
                const records = await TweetModel.find().sort({createdAt: -1}).skip(+skip).limit(+size).exec();
                const tweets = await Promise.all(records.map(async (tweet): Promise<TweetDto> => {
                    const user = await UserModel.findOne({_id: tweet.userId}).exec() as IUser;
                    return {
                        _id: tweet._id,
                        text: tweet.text,
                        pics: tweet.pics,
                        user: {
                            _id: user?._id,
                            name: user?.name,
                            avatar: user?.avatar
                        },
                        likes: tweet.likes,
                        bookmarksCount: tweet.bookmarksCount,
                        replyCount: tweet.replies.length
                    };
                }));

                res.status(200).json(tweets);
            } else {
                res.status(500).send("'skip' and 'size' params required");
            }
        } catch (err) {
            console.log(err);
        }
    },

    getTweet: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const tweet = await TweetModel.findOne({_id: id}).exec();
            if (tweet !== null) {
                const {_id, name, avatar} = await UserModel.findOne({_id: tweet.userId}).exec() as IUser;
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
            } else {
                res.status(404).send(":(");
            }
        } catch (err) {
            console.log(err);
        }
    },

    replyTweet: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const {text} = req.body;
            const tweet = await TweetModel.findOne({_id: id}).exec();
            if (tweet !== null && req.user) {
                const reply: Reply = {
                    text: text,
                    user: {
                        _id: (req.user as IUser)._id,
                        name: (req.user as IUser).name,
                        avatar: (req.user as IUser).avatar
                    }
                }
                tweet.replies.unshift(reply);
                await tweet.save();
                res.status(200).send("OK");
            } else {
                res.status(404).send(":(");
            }
        } catch (err) {
            console.log(err);
        }
    },

    getReplies: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const tweet = await TweetModel.findOne({_id: id}).exec();
            if (tweet !== null) {
                res.status(200).send(tweet.replies);
            } else {
                res.status(404).send(":(");
            }
        } catch (err) {
            console.log(err);
        }
    },

    getUserTweets: async function (req: any, res: express.Response) {
        try {
            const {skip, size} = req.query;
            const {id} = req.params;
            if (skip && size) {
                const records = await TweetModel.find({userId: id}).sort({createdAt: -1}).skip(+skip).limit(+size).exec();
                const tweets = await Promise.all(records.map(async (tweet): Promise<TweetDto> => {
                    const {_id, name, avatar} = await UserModel.findOne({_id: tweet.userId}).exec() as IUser;
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
                }));

                res.status(200).json(tweets);
            } else {
                res.status(500).send("'skip' and 'size' params required");
            }
        } catch (err) {
            console.log(err);
        }
    },

    getLikedTweets: async function (req: any, res: express.Response) {
        try {
            let {skip, size} = req.query;
            const {id} = req.params;
            if (skip && size) {
                const user = await UserModel.findOne({_id: id}).exec() as IUser;
                if (user && (+skip < user.likedTweets.length)) {
                    const tweets = await Promise.all(user.likedTweets.map(async (_id: string, index: number): Promise<TweetDto | void> => {
                        console.log("1");
                        //@ts-ignore
                        if (index >= (+skip) - 1 && index < (+skip - 1) + (+size)) {
                            console.log("2");
                            const tweet = await TweetModel.findOne({_id: _id}).exec() as ITweet;
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
                    }));
                    console.log(tweets);
                    res.status(200).json(tweets);
                } else {
                    res.status(200).json([]);
                }
            } else {
                res.status(500).send("'skip' and 'size' params required");
            }
        } catch (err) {
            console.log(err);
        }
    },

    like: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const userId = (req.user as IUser)._id;

            const tweet = await TweetModel.findOne({_id: id}).exec();
            const user = await UserModel.findOne({_id: userId}).exec();

            if (tweet && user && !user.likedTweets.includes(id)) {
                tweet.likes += 1;
                user.likedTweets.push(tweet._id);

                await tweet.save();
                await user.save();

                res.status(200).send("Ok");
            } else {
                res.status(500).send("Something wrong");
            }
        } catch (err) {
            console.log(err);
        }
    },
    unlike: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const userId = (req.user as IUser)._id;

            const tweet = await TweetModel.findOne({_id: id}).exec();
            const user = await UserModel.findOne({_id: userId}).exec();

            if (tweet && user && user.likedTweets.includes(id)) {
                tweet.likes -= 1;
                user.likedTweets = user.likedTweets.filter(function (likedTweetId) {
                    return likedTweetId !== tweet.id;
                });

                await tweet.save();
                await user.save();

                res.status(200).send("Ok");
            } else {
                res.status(500).send("Something wrong");
            }
        } catch (err) {
            console.log(err);
        }
    },

    addBookmark: async function (req: any, res: express.Response) {
        try {
            const {id} = req.params;
            const userId = (req.user as IUser)._id;

            const tweet = await TweetModel.findOne({_id: id}).exec();
            const user = await UserModel.findOne({_id: userId}).exec();

            if (tweet && user && !user.likedTweets.includes(id)) {
                tweet.bookmarksCount += 1;
                user.bookmarks.push(tweet.id);

                await tweet.save();
                await user.save();

                res.status(200).send("Ok");
            } else {
                res.status(500).send("Something wrong");
            }
        } catch (err) {
            console.log(err);
        }
    },

    getBookmarks: async function (req: any, res: express.Response) {
        try {
            let {skip, size} = req.query;
            const {_id} = req.user;

            if (skip && size) {
                const user = await UserModel.findOne({_id: _id}).exec() as IUser;
                if (user && (+skip < user.bookmarks.length)) {
                    const tweets = await Promise.all(user.bookmarks.map(async (_id: string, index: number): Promise<TweetDto | void> => {
                        console.log("1");
                        //@ts-ignore
                        if (index >= (+skip) - 1 && index < (+skip - 1) + (+size)) {
                            console.log("2");
                            const tweet = await TweetModel.findOne({_id: _id}).exec() as ITweet;
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
                    }));
                    console.log(tweets);
                    res.status(200).json(tweets);
                } else {
                    res.status(200).json([]);
                }
            } else {
                res.status(500).send("'skip' and 'size' params required");
            }
        } catch (err) {
            console.log(err);
        }
    },

    removeBookmark: (req: any, res: any) => {},

    getUserData: async (req: any, res: any) => {
        try {
            const {id} = req.params;
            const user = await UserModel.findOne({_id: id}).exec() as IUser;

            if (user) {
                res.status(200).json({
                    _id: id,
                    name: user?.name,
                    surname: user?.surname,
                    email: user?.email,
                    avatar: user?.avatar,
                    likedTweets: user?.likedTweets,
                    bookmarks: user?.bookmarks,
                    followers: user?.followers,
                    followings: user?.followings
                })
            } else {
                res.status(500).send("Something goes wrong");
            }
        } catch (err) {
            console.log(err);
        }
    }
}