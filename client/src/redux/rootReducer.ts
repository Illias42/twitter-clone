import { combineReducers } from 'redux';
import { tweetsReducer } from './tweets/reducer';
import {userReducer} from "./user/reducer";

export const rootReducer = combineReducers({
    tweets: tweetsReducer,
    user: userReducer
})