import produce, { Draft } from 'immer';
import { TweetsActionType } from './actionCreators';
import { TweetsActions } from './actionTypes';
import { TweetState } from './contracts/state';

const initialTweetsState: TweetState = {
    items: [],
    replies: [],
    loading: false,
    end: false,
}

export const tweetsReducer = produce((draft: Draft<TweetState>, action: TweetsActions) => {
    if(action.type === TweetsActionType.SET_TWEETS) {
        draft.loading = false;
        draft.items = [...draft.items, ...action.payload];
    }
    if(action.type === TweetsActionType.LOADING) {
        draft.loading = true;
    }
    if(action.type === TweetsActionType.SET_LOADED) {
        draft.loading = false;
    }
    if(action.type === TweetsActionType.CLEAR_TWEETS) {
        draft.items = [];
    }
    if(action.type === TweetsActionType.SET_TWEET) {
        draft.items[0] = action.payload;
    }
    if(action.type === TweetsActionType.SET_REPLIES) {
        // @ts-ignore
        draft.replies = action.payload;
    }
    if(action.type === TweetsActionType.SET_END) {
        draft.end = action.payload;
    }
}, initialTweetsState);
