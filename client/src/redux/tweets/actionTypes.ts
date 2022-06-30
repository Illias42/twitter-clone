import {Action} from "redux";
import {Reply, Tweet, TweetState} from "../tweets/contracts/state";
import {TweetsActionType} from "../tweets/actionCreators";

export interface End extends Action<TweetsActionType> {
    type: TweetsActionType.SET_END,
    payload: boolean
}

export interface GetTweets extends Action<TweetsActionType> {
    type: TweetsActionType.GET_TWEETS,
    payload: {
        skip: number,
        size: number
    }
}

export interface GetBookmarks extends Action<TweetsActionType> {
    type: TweetsActionType.GET_BOOKMARKS,
    payload: {
        skip: number,
        size: number
    }
}

export interface GetLikedTweets extends Action<TweetsActionType> {
    type: TweetsActionType.GET_LIKED_TWEETS,
    payload: {
        id: number,
        skip: number,
        size: number
    }
}

export interface GetUserTweets extends Action<TweetsActionType> {
    type: TweetsActionType.GET_USER_TWEETS,
    payload: {
        id: number,
        skip: number,
        size: number
    }
}

export interface GetTweet extends Action<TweetsActionType> {
    type: TweetsActionType.GET_TWEET,
    payload: string
}

export interface Loading extends Action<TweetsActionType> {
    type: TweetsActionType.LOADING
}

export interface SetLoaded extends Action<TweetsActionType> {
    type: TweetsActionType.SET_LOADED
}

export interface SetTweets extends Action<TweetsActionType> {
    type: TweetsActionType.SET_TWEETS,
    payload: TweetState['items'],
}

export interface ClearTweets extends Action<TweetsActionType> {
    type: TweetsActionType.CLEAR_TWEETS
}

export interface SetTweet extends Action<TweetsActionType> {
    type: TweetsActionType.SET_TWEET,
    payload: Tweet
}

export interface CreateTweet extends Action<TweetsActionType> {
    type: TweetsActionType.CREATE_TWEET,
    payload: FormData
}


export interface ReplyTweet extends Action<TweetsActionType> {
    type: TweetsActionType.REPLY_TWEET,
    payload: {
        text: string,
        id: string
    }
}

export interface GetReplies extends Action<TweetsActionType> {
    type: TweetsActionType.GET_REPLIES,
    payload: string
}

export interface SetReplies extends Action<TweetsActionType> {
    type: TweetsActionType.SET_REPLIES,
    payload: Reply[]
}

export type TweetsActions = End
    | GetTweets
    | GetTweet
    | Loading
    | SetLoaded
    | SetTweets
    | ClearTweets
    | SetTweet
    | CreateTweet
    | ReplyTweet
    | GetReplies
    | SetReplies
    | GetBookmarks
    | GetLikedTweets
    | GetUserTweets;