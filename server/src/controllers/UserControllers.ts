import express from "express";
import {IUser, UserDocument, UserModel} from "../models/User";
import crypto from "crypto";
import createHash from "../utils/createHash";
import {v4} from "uuid";
import jwt from "jsonwebtoken";
import {TweetDto} from "../models/Tweet";

export default {
    register: async function(req: any, res: express.Response) {
        const {name, surname, email, password} = req.body;
        const user = await UserModel.findOne({email: email}).lean();

        if (!user) {
            try {
                const salt = crypto.randomBytes(16).toString('hex');
                const hash = createHash(password, salt);
                let avatar = "blank.png";
                console.log(req.file);
                if (req.file) {
                    //@ts-ignore
                    avatar = req.file.filename;
                }
                const user = new UserModel({
                    _id: v4().toString(),
                    name: name,
                    surname: surname,
                    email: email,
                    password: hash,
                    followers: [],
                    followings: [],
                    avatar: avatar,
                    salt: salt,
                    likedTweets: [],
                    bookmarks: []
                });
                await user.save();

                let {password: _, salt: __, ...userData} = user.toObject() as any;
                userData.token = jwt.sign({data: userData}, 'secret');

                res.status(200).send(userData);
            } catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        } else {
            res.status(409).send("User already exists!");
        }
    },

    login: async function(req: any, res: express.Response) {
        try {
            const {_id} = req.user as IUser;

            const user = await UserModel.findOne({_id: _id}).exec();

            res.json({
                _id: _id,
                name: user?.name,
                surname: user?.surname,
                email: user?.email,
                likedTweets: user?.likedTweets,
                bookmarks: user?.bookmarks,
                followers: user?.followers,
                followings: user?.followings,
                avatar: user?.avatar,
                token: jwt.sign({data: req.user}, "secret", {
                    expiresIn: '30 days',
                })
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    },

    userData: async function(req: any, res: express.Response) {
        try {
            const {_id} = req.user as IUser;
            const user = await UserModel.findOne({_id: _id}).exec();

            res.status(200).json({
                _id: _id,
                name: user?.name,
                email: user?.email,
                avatar: user?.avatar,
                likedTweets: user?.likedTweets,
                bookmarks: user?.bookmarks,
                followers: user?.followers,
                followings: user?.followings
            })
        } catch (err) {
            res.status(500).send("Something goes wrong!");
        }
    },

    follow: async function (req: any, res: express.Response) {
        try {
            const userId = req.params.id;
            const followerId = req.user._id;

            const user = await UserModel.findOne({_id: userId}).exec();
            const follower = await UserModel.findOne({_id: followerId}).exec();

            user?.followers.unshift(followerId);
            follower?.followings.unshift(userId);

            await user?.save();
            await follower?.save();

            res.status(200).send("OK");
        } catch (err) {
            res.status(500).send("Something goes wrong!");
        }
    },

    unfollow: async function (req: any, res: express.Response) {
        try {
            const userId = req.params.id;
            const followerId = req.user._id;

            const user = await UserModel.findOne({_id: userId}).exec() as UserDocument;
            const follower = await UserModel.findOne({_id: followerId}).exec() as UserDocument;

            user.followers = user.followers.filter(id => id !== followerId);
            follower.followings = follower.followings.filter(id => id !== userId);

            await user.save();
            await follower.save();

            res.status(200).send("OK");
        } catch (err) {
            res.status(500).send("Something goes wrong!");
        }
    },

    getFollowers: async function (req: any, res: express.Response) {
        try {
            const userId = req.params.id;
            const user = await UserModel.findOne({_id: userId}).exec() as UserDocument;

            if(user) {
                const followers = await Promise.all(user.followers.map(async (followerId) => {
                    const follower = await UserModel.findOne({_id: followerId}).exec();
                    if (follower) {
                        return {
                            _id: follower._id,
                            name: follower.name,
                            avatar: follower.avatar
                        };
                    }
                }));

                res.status(200).json(followers);
            } else {
                res.status(404);
            }
        } catch (err) {
            res.status(500).send("Something goes wrong!");
        }
    },

    getFollowings: async function (req: any, res: express.Response) {
        try {
            const userId = req.params.id;
            const user = await UserModel.findOne({_id: userId}).exec() as UserDocument;

            if(user) {
                const followings = await Promise.all(user.followings.map(async (followingId) => {
                    const following = await UserModel.findOne({_id: followingId}).exec();
                    if (following) {
                        return {
                            _id: following._id,
                            name: following.name,
                            avatar: following.avatar
                        };
                    }
                }));

                res.status(200).json(followings);
            } else {
                res.status(404);
            }
        } catch (err) {
            res.status(500).send("Something goes wrong!");
        }
    }
}