import axios from "../utils/axios";
import {Tweet, Reply} from "../redux/tweets/contracts/state";

function createTweet(payload: any) {
    return axios.post<string>("/createtweet", payload);
}

function getTweets(skip: number, size: number) {
    return axios.get<Tweet[]>(`/tweets?skip=${skip}&size=${size}`);
}

function getBookmarks(skip: number, size: number) {
    return axios.get<Tweet[]>(`/user/bookmarks?skip=${skip}&size=${size}`);
}

function getUserTweets(id: number, skip: number, size: number) {
    return axios.get<Tweet[]>(`/profile/${id}/tweets?size=${size}&skip=${skip}`);
}

function getLikedTweets(id: number, skip: number, size: number) {
    return axios.get<Tweet[]>(`/profile/${id}/liked?size=${size}&skip=${skip}`);
}

function getTweet(id: string) {
    return axios.get<Tweet>(`/tweet/${id}`);
}

function replyTweet(id: string, text: string) {
    return axios.post<string>(`/tweet/${id}/reply`, {text});
}

function getReplies(id: string) {
    return axios.get<Reply[]>(`/tweet/${id}/replies`);
}

export default {
    getTweets: getTweets,
    getTweet: getTweet,
    create: createTweet,
    reply: replyTweet,
    getReplies: getReplies,
    getBookmarks: getBookmarks,
    getLikedTweets: getLikedTweets,
    getUserTweets: getUserTweets
}