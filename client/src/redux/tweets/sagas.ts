import { call, takeEvery, takeLatest, put } from "redux-saga/effects";
import {AxiosResponse} from "axios";
import {
    setTweet,
    setTweets,
    clearTweets,
    loading,
    TweetsActionType, setEnd, setReplies
} from "./actionCreators";
import tweetApi from "../../api/tweetApi";
import {Reply, Tweet} from "./contracts/state";
import * as actionTypes from "./actionTypes";

function* createTweet(action: actionTypes.CreateTweet) {
    try {
        const response: AxiosResponse<string> = yield call(tweetApi.create, action.payload);
        console.log("Create tweet: ", response.data);
    } catch (err) {
        console.log(err);
    }
}

function* getTweets(action: actionTypes.GetTweets) {
    try {
        const {payload: {skip, size}} = action;
        yield put(loading())
        if (skip === 0) yield put(clearTweets());
        const tweets: AxiosResponse<Tweet[]> = yield call(tweetApi.getTweets, skip, size);
        if (tweets.data.length === 0) yield put(setEnd(true));
        yield put(setTweets(tweets.data));
    } catch (err) {
        console.log(err);
    }
}

function* getBookmarks(action: actionTypes.GetBookmarks) {
    try {
        const {payload: {skip, size}} = action;
        yield put(loading())
        if (skip === 0) yield put(clearTweets());
        const tweets: AxiosResponse<Tweet[]> = yield call(tweetApi.getBookmarks, skip, size);
        if (tweets.data.length === 0) yield put(setEnd(true));
        yield put(setTweets(tweets.data));
    } catch (err) {
        console.log(err);
    }
}

function* getLikedTweets(action: actionTypes.GetLikedTweets) {
    try {
        const {payload: {id, skip, size}} = action;
        yield put(loading())
        if (skip === 0) yield put(clearTweets());
        const tweets: AxiosResponse<Tweet[]> = yield call(tweetApi.getLikedTweets, id, skip, size);
        if (tweets.data.length === 0) yield put(setEnd(true));
        yield put(setTweets(tweets.data));
    } catch (err) {
        console.log(err);
    }
}

function* getUserTweets(action: actionTypes.GetUserTweets) {
    try {
        const {payload: {id, skip, size}} = action;
        yield put(loading())
        if (skip === 0) yield put(clearTweets());
        const tweets: AxiosResponse<Tweet[]> = yield call(tweetApi.getUserTweets, id, skip, size);
        if (tweets.data.length === 0) yield put(setEnd(true));
        yield put(setTweets(tweets.data));
    } catch (err) {
        console.log(err);
    }
}

function* getTweet(action: actionTypes.GetTweet) {
    try {
        const { payload } = action;
        const tweet: AxiosResponse<Tweet> = yield call(tweetApi.getTweet, payload);
        yield put(setTweet(tweet.data));
    } catch (err) {
        console.log(err);
    }
}

function* replyTweet(action: actionTypes.ReplyTweet) {
    try {
        const { payload: {id, text} } = action;
        yield call(tweetApi.reply, id, text);
    } catch (err) {
        console.log(err);
    }
}

function* getReplies(action: actionTypes.GetReplies) {
    try {
        const { payload } = action;
        const replies: AxiosResponse<Reply[]> = yield call(tweetApi.getReplies, payload);
        yield put(setReplies(replies.data));
    } catch (err) {
        console.log(err);
    }
}

export default function* watchTweets() {
    yield takeEvery(TweetsActionType.CREATE_TWEET, createTweet);
    yield takeLatest(TweetsActionType.GET_TWEET, getTweet);
    yield takeLatest(TweetsActionType.GET_TWEETS, getTweets);
    yield takeEvery(TweetsActionType.REPLY_TWEET, replyTweet);
    yield takeLatest(TweetsActionType.GET_REPLIES, getReplies);
    yield takeLatest(TweetsActionType.GET_BOOKMARKS, getBookmarks)
    yield takeLatest(TweetsActionType.GET_LIKED_TWEETS, getLikedTweets)
    yield takeLatest(TweetsActionType.GET_USER_TWEETS, getUserTweets);
}