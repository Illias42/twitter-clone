import {Reply, Tweet, TweetState} from './contracts/state';
import {action} from "typesafe-actions";
import * as actionTypes from "./actionTypes";

export enum TweetsActionType {
    SET_TWEETS = 'tweets/SET_TWEETS',
    GET_TWEETS = 'tweets/GET_TWEETS',
    CLEAR_TWEETS = 'tweets/CLEAR_TWEETS',
    SET_TWEET = 'tweets/SET_TWEET',
    GET_TWEET = 'tweets/GET_TWEET',
    CREATE_TWEET = 'tweets/CREATE_TWEET',
    REPLY_TWEET = 'tweets/REPLY_TWEET',
    GET_REPLIES = 'tweets/GET_REPLIES',
    SET_REPLIES = 'tweets/SET_REPLIES',
    GET_BOOKMARKS = 'tweets/GET_BOOKMARKS',
    GET_LIKED_TWEETS = "tweets/GET_LIKED_TWEETS",
    GET_USER_TWEETS = "tweets/GET_USER_TWEETS",
    LOADING = 'tweets/LOADING',
    SET_LOADED = 'tweets/SET_LOADED',
    SET_END = 'tweets/SET_END'
}

export const setEnd = (payload: boolean): actionTypes.End => (
    action(TweetsActionType.SET_END, payload)
)

export const loading = (): actionTypes.Loading => {
    return action(TweetsActionType.LOADING);
}

export const setLoaded = (): actionTypes.SetLoaded => {
    return action(TweetsActionType.SET_LOADED);
}

export const setTweets = (payload: TweetState['items']): actionTypes.SetTweets => {
    return action(TweetsActionType.SET_TWEETS, payload);
}

export const clearTweets = (): actionTypes.ClearTweets => {
    return action(TweetsActionType.CLEAR_TWEETS);
}

export const setTweet = (payload: Tweet): actionTypes.SetTweet => {
    return action(TweetsActionType.SET_TWEET, payload);
}

export const createTweet = (payload: FormData): actionTypes.CreateTweet => {
    return action(TweetsActionType.CREATE_TWEET, payload);
}

export const getBookmarks = (skip: number, size: number): actionTypes.GetBookmarks => {
    return action(TweetsActionType.GET_BOOKMARKS, {
        skip,
        size
    });
}

export const getUserTweets = (id: number, skip: number, size: number): actionTypes.GetUserTweets => {
    return action(TweetsActionType.GET_USER_TWEETS, {
        id,
        skip,
        size
    });
}

export const getLikedTweets = (id: number, skip: number, size: number): actionTypes.GetLikedTweets => {
    return action(TweetsActionType.GET_LIKED_TWEETS, {
        id,
        skip,
        size
    });
}

export const getTweets = (skip: number, size: number): actionTypes.GetTweets => {
    return action(TweetsActionType.GET_TWEETS, {
        skip,
        size
    });
}

export const getTweet = (id: string): actionTypes.GetTweet => {
    return action(TweetsActionType.GET_TWEET, id);
}

export const replyTweet = (payload: {id: string, text: string}): actionTypes.ReplyTweet => {
    return action(TweetsActionType.REPLY_TWEET, payload);
}

export const getReplies = (payload: string): actionTypes.GetReplies => {
    return action(TweetsActionType.GET_REPLIES, payload);
}

export const setReplies = (payload: Reply[]): actionTypes.SetReplies => {
    return action(TweetsActionType.SET_REPLIES, payload);
}