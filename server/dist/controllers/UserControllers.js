var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { UserModel } from "../models/User";
import crypto from "crypto";
import createHash from "../utils/createHash";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
export default {
    register: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, surname, email, password } = req.body;
            const user = yield UserModel.findOne({ email: email }).lean();
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
                    yield user.save();
                    let _a = user.toObject(), { password: _, salt: __ } = _a, userData = __rest(_a, ["password", "salt"]);
                    userData.token = jwt.sign({ data: userData }, 'secret');
                    res.status(200).send(userData);
                }
                catch (err) {
                    res.status(500).send("Something goes wrong!");
                }
            }
            else {
                res.status(409).send("User already exists!");
            }
        });
    },
    login: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const user = yield UserModel.findOne({ _id: _id }).exec();
                res.json({
                    _id: _id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    surname: user === null || user === void 0 ? void 0 : user.surname,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    likedTweets: user === null || user === void 0 ? void 0 : user.likedTweets,
                    bookmarks: user === null || user === void 0 ? void 0 : user.bookmarks,
                    followers: user === null || user === void 0 ? void 0 : user.followers,
                    followings: user === null || user === void 0 ? void 0 : user.followings,
                    avatar: user === null || user === void 0 ? void 0 : user.avatar,
                    token: jwt.sign({ data: req.user }, "secret", {
                        expiresIn: '30 days',
                    })
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error,
                });
            }
        });
    },
    userData: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.user;
                const user = yield UserModel.findOne({ _id: _id }).exec();
                res.status(200).json({
                    _id: _id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    avatar: user === null || user === void 0 ? void 0 : user.avatar,
                    likedTweets: user === null || user === void 0 ? void 0 : user.likedTweets,
                    bookmarks: user === null || user === void 0 ? void 0 : user.bookmarks,
                    followers: user === null || user === void 0 ? void 0 : user.followers,
                    followings: user === null || user === void 0 ? void 0 : user.followings
                });
            }
            catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        });
    },
    follow: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const followerId = req.user._id;
                const user = yield UserModel.findOne({ _id: userId }).exec();
                const follower = yield UserModel.findOne({ _id: followerId }).exec();
                user === null || user === void 0 ? void 0 : user.followers.unshift(followerId);
                follower === null || follower === void 0 ? void 0 : follower.followings.unshift(userId);
                yield (user === null || user === void 0 ? void 0 : user.save());
                yield (follower === null || follower === void 0 ? void 0 : follower.save());
                res.status(200).send("OK");
            }
            catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        });
    },
    unfollow: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const followerId = req.user._id;
                const user = yield UserModel.findOne({ _id: userId }).exec();
                const follower = yield UserModel.findOne({ _id: followerId }).exec();
                user.followers = user.followers.filter(id => id !== followerId);
                follower.followings = follower.followings.filter(id => id !== userId);
                yield user.save();
                yield follower.save();
                res.status(200).send("OK");
            }
            catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        });
    },
    getFollowers: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield UserModel.findOne({ _id: userId }).exec();
                if (user) {
                    const followers = yield Promise.all(user.followers.map((followerId) => __awaiter(this, void 0, void 0, function* () {
                        const follower = yield UserModel.findOne({ _id: followerId }).exec();
                        if (follower) {
                            return {
                                _id: follower._id,
                                name: follower.name,
                                avatar: follower.avatar
                            };
                        }
                    })));
                    res.status(200).json(followers);
                }
                else {
                    res.status(404);
                }
            }
            catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        });
    },
    getFollowings: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield UserModel.findOne({ _id: userId }).exec();
                if (user) {
                    const followings = yield Promise.all(user.followings.map((followingId) => __awaiter(this, void 0, void 0, function* () {
                        const following = yield UserModel.findOne({ _id: followingId }).exec();
                        if (following) {
                            return {
                                _id: following._id,
                                name: following.name,
                                avatar: following.avatar
                            };
                        }
                    })));
                    res.status(200).json(followings);
                }
                else {
                    res.status(404);
                }
            }
            catch (err) {
                res.status(500).send("Something goes wrong!");
            }
        });
    }
};
